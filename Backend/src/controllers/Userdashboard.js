export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const shipments = await ShipmentModel.find({ sender: userId });

    const totalShipments = shipments.length;

    const delivered = shipments.filter(s => s.status === "delivered").length;

    const pending = shipments.filter(s =>
      ["created", "packed", "in_transit"].includes(s.status)
    ).length;

    const revenue = shipments.reduce((sum, s) => sum + (s.price || 0), 0);

    res.json({
      totalShipments,
      delivered,
      pending,
      revenue,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};