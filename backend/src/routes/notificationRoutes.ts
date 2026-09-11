import { Router, Response, NextFunction } from "express";
import { Notification } from "../models";
import { protect, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(protect);

router.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notifications = await Notification.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: { notifications } });
  } catch (error) {
    next(error);
  }
});

router.put("/:id/read", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { isRead: true }
    );
    res.json({ success: true, message: "Notification marquée comme lue." });
  } catch (error) {
    next(error);
  }
});

export default router;
