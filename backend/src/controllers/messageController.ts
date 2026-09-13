import { Response, NextFunction } from "express";
import { z } from "zod";
import { Conversation, Message, Notification } from "../models";
import { AppError } from "../middlewares/errorHandler";
import { AuthRequest } from "../middlewares/auth";

const startSchema = z.object({
  recipientId: z.string(),
  listingId: z.string().optional(),
  content: z.string().min(1),
});

export async function getConversations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const conversations = await Conversation.find({ participants: req.userId })
      .populate("participants", "name avatarUrl phone kycStatus")
      .populate("listing", "title photos")
      .sort({ lastMessageAt: -1 });

    res.json({ success: true, data: { conversations } });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) throw new AppError("Conversation introuvable.", 404);
    if (!conversation.participants.map(String).includes(req.userId!)) {
      throw new AppError("Accès non autorisé à cette conversation.", 403);
    }

    const messages = await Message.find({ conversation: conversation._id }).sort({
      createdAt: 1,
    });

    await Message.updateMany(
      { conversation: conversation._id, readBy: { $ne: req.userId } },
      { $addToSet: { readBy: req.userId } }
    );

    res.json({ success: true, data: { messages } });
  } catch (error) {
    next(error);
  }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { content, mediaUrl, mediaType } = req.body as {
      content?: string;
      mediaUrl?: string;
      mediaType?: "image" | "video" | "audio";
    };
    if (!content?.trim() && !mediaUrl) {
      throw new AppError("Le message ne peut pas être vide.", 422);
    }

    let conversation = await Conversation.findById(req.params.id);
    if (!conversation) throw new AppError("Conversation introuvable.", 404);
    if (!conversation.participants.map(String).includes(req.userId!)) {
      throw new AppError("Accès non autorisé à cette conversation.", 403);
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.userId,
      content: content || "",
      mediaUrl,
      mediaType,
      readBy: [req.userId],
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    const recipients = conversation.participants
      .map(String)
      .filter((id) => id !== req.userId);
    const previewText = content?.trim()
      ? content.slice(0, 140)
      : mediaType === "audio"
        ? "🎤 Message vocal"
        : mediaType === "video"
          ? "🎬 Vidéo"
          : "📷 Photo";
    await Notification.insertMany(
      recipients.map((userId) => ({
        user: userId,
        type: "nouveau_message",
        title: "Nouveau message",
        body: previewText,
        link: `/messages`,
      }))
    );

    res.status(201).json({ success: true, data: { message } });
  } catch (error) {
    next(error);
  }
}

export async function startConversation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const data = startSchema.parse(req.body);

    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, data.recipientId] },
      listing: data.listingId || null,
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.userId, data.recipientId],
        listing: data.listingId,
        lastMessageAt: new Date(),
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.userId,
      content: data.content,
      readBy: [req.userId],
    });

    await Notification.create({
      user: data.recipientId,
      type: "nouveau_message",
      title: "Nouveau message",
      body: data.content.slice(0, 140),
      link: "/messages",
    });

    res.status(201).json({ success: true, data: { conversation, message } });
  } catch (error: any) {
    if (error?.issues) return next(new AppError(error.issues[0].message, 422));
    next(error);
  }
}
