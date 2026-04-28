import AsyncHandler from "../utils/Asynchandler.js";
import Support from "../Models/Support.model.js";
import { sendNotification } from "../index.js";
import User from "../Models/User.model.js";

/* ---------------- CREATE TICKET ---------------- */
const createSupport = AsyncHandler(async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Subject and message are required",
    });
  }

  const ticket = await Support.create({
    userId: req.user._id,
    subject,
    messages: [
      {
        senderId: req.user._id,
        role: "user",
        message,
      },
    ],
  });

  // USER NOTIFICATION
  sendNotification(req.user._id.toString(), {
    title: "Ticket Created",
    message: "Your support ticket has been created",
    type: "support",
    ticketId: ticket._id.toString(),
  });

  // ADMIN NOTIFICATION
  const admins = await User.find({ role: "admin" });

  for (let admin of admins) {
    sendNotification(admin._id.toString(), {
      title: "New Ticket",
      message: `New ticket from ${req.user.fullName}`,
      type: "support",
      ticketId: ticket._id.toString(),
    });
  }

  return res.status(201).json({
    success: true,
    message: "Support ticket created successfully",
    data: ticket,
  });
});

/* ---------------- GET MY TICKETS ---------------- */
const getmyticket = AsyncHandler(async (req, res) => {
  const tickets = await Support.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json({
    success: true,
    message: "Support tickets retrieved successfully",
    data: tickets,
  });
});

/* ---------------- GET ALL (ADMIN) ---------------- */
const getAllTickets = AsyncHandler(async (req, res) => {
  const tickets = await Support.find()
    .populate("userId")
    .sort({ createdAt: -1 });

  return res.json({
    success: true,
    data: tickets,
  });
});

/* ---------------- GET TICKET BY ID ---------------- */
const getTicketById = AsyncHandler(async (req, res) => {
  const ticket = await Support.findById(req.params.id)
    .populate("userId")
    .lean();

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  return res.json({
    success: true,
    data: ticket,
  });
});
/* ---------------- UPDATE TICKET ---------------- */
const updateSupport = AsyncHandler(async (req, res) => {
  const { status, adminReply } = req.body;

  const ticket = await Support.findByIdAndUpdate(
    req.params.id,
    { status, adminReply },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Support ticket not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Support ticket updated successfully",
    data: ticket,
  });
});

/* ---------------- SEND MESSAGE ---------------- */
const sendMessage = AsyncHandler(async (req, res) => {
  const { ticketId, message, role } = req.body;

  if (!ticketId || !message) {
    return res.status(400).json({
      success: false,
      message: "TicketId and message are required",
    });
  }

  const ticket = await Support.findByIdAndUpdate(
    ticketId,
    {
      $push: {
        messages: {
          senderId: req.user._id.toString(),
          role,
          message,
        },
      },
    },
    { new: true }
  );

  if (!ticket) {
    return res.status(404).json({
      success: false,
      message: "Ticket not found",
    });
  }

  const cleanRole = role?.toLowerCase();

  if (cleanRole === "admin") {
    // ADMIN → USER
    sendNotification(ticket.userId.toString(), {
      title: "Support Reply",
      message: "Admin replied to your ticket",
      type: "chat",
      ticketId: ticket._id.toString(),
    });
  } else {
    // USER → ADMIN
    const admins = await User.find({ role: "admin" });

    for (let admin of admins) {
      sendNotification(admin._id.toString(), {
        title: "New Message",
        message: "New message from user",
        type: "chat",
        ticketId: ticket._id.toString(),
      });
    }
  }

  return res.status(200).json({
    success: true,
    data: ticket,
  });
});

export {
  createSupport,
  getmyticket,
  getAllTickets,
  updateSupport,
  sendMessage,
  getTicketById
};