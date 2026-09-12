import { Response, NextFunction } from "express";
import { z } from "zod";
import { Listing } from "../models/Listing";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const createSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  category: z.enum([
    "chambre",
    "maison",
    "appartement",
    "villa",
    "parcelle",
    "bureau",
    "meuble",
  ]),
  transactionType: z.enum(["location", "vente", "reservation"]),
  price: z.number().positive(),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  address: z.string().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  surfaceM2: z.number().positive().optional(),
  furnished: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

// GET /api/listings — recherche + filtres + tri + pagination
export async function getListings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const {
      q,
      category,
      transactionType,
      city,
      neighborhood,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnished,
      sort = "recent",
      page = "1",
      limit = "12",
    } = req.query as Record<string, string>;

    const filter: Record<string, any> = { status: "approuvee" };

    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [
        { title: re },
        { description: re },
        { city: re },
        { neighborhood: re },
      ];
    }
    if (category) filter.category = category;
    if (transactionType) filter.transactionType = transactionType;
    if (city) filter.city = new RegExp(city, "i");
    if (neighborhood) filter.neighborhood = new RegExp(neighborhood, "i");
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (furnished !== undefined) filter.furnished = furnished === "true";
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap: Record<string, any> = {
      recent: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      popular: { viewsCount: -1 },
    };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .sort(sortMap[sort] || sortMap.recent)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("owner", "name avatarUrl kycStatus"),
      Listing.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getListingById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate("owner", "name avatarUrl phone kycStatus");

    if (!listing) throw new AppError("Annonce introuvable.", 404);

    const similar = await Listing.find({
      _id: { $ne: listing._id },
      city: listing.city,
      category: listing.category,
      status: "approuvee",
    }).limit(4);

    res.json({ success: true, data: { listing, similar } });
  } catch (error) {
    next(error);
  }
}

export async function createListing(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createSchema.parse(req.body);
    const listing = await Listing.create({
      ...data,
      owner: req.userId,
      status: "en_attente",
    });
    res.status(201).json({
      success: true,
      message: "Annonce publiée. Elle est en attente de validation par un administrateur.",
      data: { listing },
    });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}

export async function updateListing(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new AppError("Annonce introuvable.", 404);

    const isOwner = listing.owner.toString() === req.userId;
    if (!isOwner && req.userRole !== "admin") {
      throw new AppError("Vous ne pouvez modifier que vos propres annonces.", 403);
    }

    Object.assign(listing, req.body);
    if (isOwner && req.userRole !== "admin") {
      listing.status = "en_attente"; // repasse en modération après modification
    }
    await listing.save();

    res.json({ success: true, message: "Annonce mise à jour.", data: { listing } });
  } catch (error) {
    next(error);
  }
}

export async function deleteListing(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) throw new AppError("Annonce introuvable.", 404);

    const isOwner = listing.owner.toString() === req.userId;
    if (!isOwner && req.userRole !== "admin") {
      throw new AppError("Vous ne pouvez supprimer que vos propres annonces.", 403);
    }

    await listing.deleteOne();
    res.json({ success: true, message: "Annonce supprimée." });
  } catch (error) {
    next(error);
  }
}

export async function getMyListings(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const listings = await Listing.find({ owner: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: { listings } });
  } catch (error) {
    next(error);
  }
}

export async function getMyStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const listings = await Listing.find({ owner: req.userId });

    const totalViews = listings.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
    const byStatus = listings.reduce((acc: Record<string, number>, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    }, {});

    const topListings = [...listings]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 5)
      .map((l) => ({ id: l._id, title: l.title, viewsCount: l.viewsCount || 0, status: l.status }));

    res.json({
      success: true,
      data: {
        totalListings: listings.length,
        totalViews,
        byStatus,
        topListings,
      },
    });
  } catch (error) {
    next(error);
  }
}
