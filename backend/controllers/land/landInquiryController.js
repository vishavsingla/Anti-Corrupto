const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create Inquiry
exports.createInquiry = async (req, res) => {
  const { clientId, landId } = req.body;

  if (true) {
    // Check if an inquiry already exists for this client and land

    const existingInquiry = await prisma.landInquiry.findFirst({
      where: {
        clientId,
        landId,
      },
    });

    if (existingInquiry != null) {
      return res.status(400).json({
        error: "An inquiry for this land by the same client already exists.",
      });
    }
     
    // If no inquiry exists, create a new one
    const newInquiry = await prisma.landInquiry.create({
      data: {
        clientId,
        landId,
      },
    });

    res.status(201).json(newInquiry);
  }
  // catch (error) {
  //   res.status(400).json({ error: error.message });
  // }
};

// Get All Inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.landInquiry.findMany({
      include: {
        land: true, // Fetch associated land details
      },
    });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Inquiry by ID
exports.getInquiryById = async (req, res) => {
  const { clientId } = req.params;

  try {
    const inquiry = await prisma.landInquiry.findMany({
      where: { clientId },
      include: {
        land: true, // Fetch associated land details
      },
    });

    if (inquiry) {
      res.json(inquiry);
    } else {
      res.status(404).json({ error: "Inquiry not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInquiryBylandId = async (req, res) => {
  const { id } = req.params;
  const landId = id;

  try {
    const lands = await prisma.landInquiry.findMany({
      where: { landId },
      include: {
        land: true, // Fetch associated land details
      },
    });

    if (lands) {
      res.status(200).json(lands);
    } else {
      res.status(404).json({ error: "Lands not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Inquiry Status
exports.updateInquiry = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedInquiry = await prisma.landInquiry.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ message: "Approved the Land Status" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Inquiry
exports.deleteInquiry = async (req, res) => {
  const { landId } = req.params;

  try {
    await prisma.landInquiry.delete({
      where: { landId },
    });

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInquiryAfterTransfer = async (landId) => {
  try {
    await prisma.landInquiry.delete({
      where: { landId },
    });

    return 200;
  } catch (error) {
    return 400;
  }
};
