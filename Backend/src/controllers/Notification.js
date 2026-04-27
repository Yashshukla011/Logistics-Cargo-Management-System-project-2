import Notification from "../Models/Notification.model.js";
import { sendNotification } from "../server.js";

export const createNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    const notification = await Notification.create({
      userId,
      title,
      message,
    });
       
    // 🔥 REALTIME PUSH
    sendNotification(userId, notification);

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};