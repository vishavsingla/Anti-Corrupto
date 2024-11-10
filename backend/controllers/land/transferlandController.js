const { PrismaClient } = require('@prisma/client');
const { getLandById, updateLand } = require('./landController');
const { deleteInquiryAfterTransfer } = require('./landInquiryController');
const prisma = new PrismaClient();

const createTransferLand = async (req, res) => {
  try {
    var { prevOwnerId, currentOwnerId, landIdBackend, landIdWeb3, transferAmount } = req.body;

    if (!prevOwnerId || !currentOwnerId || !landIdBackend || !landIdWeb3 || !transferAmount) {
      return res.status(203).json({ message: "Please provide all required fields" });
    }
    
    const newTransferLand = await prisma.TransferLand.create({
      data: {
        prevOwnerId,
        currentOwnerId,
        landId:landIdBackend,
        landIdWeb3,
        transferPrice:transferAmount,
      },
    });
    
    const getLandById = await prisma.land.findUnique({ where: { id: landIdBackend } });


    const updateLand = await prisma.land.update({
        where: { id: landIdBackend },
        data: {
            ownerId: currentOwnerId,
        },
    });

    const deleteInquiry = await deleteInquiryAfterTransfer(landIdBackend);
  
    res.status(200).json({ success: true, data: newTransferLand });
  } 
  catch (error) {
    res.status(203).json({ success: false, error: error.message });
  }
};

const getAllTransferLands = async (req, res) => {
  try {
    const transferLands = await prisma.transferLand.findMany();
    res.status(200).json({ success: true, data: transferLands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getTransferLandById = async (req, res) => {
  const id = req.params.id;
  try {
    const transferLand = await prisma.transferLand.findUnique({ where: { id } });
    if (!transferLand) {
      return res.status(404).json({ success: false, error: "Transfer land not found" });
    }
    res.status(200).json({ success: true, data: transferLand });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getTransferLandsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const transferLands = await prisma.transferLand.findMany({
      where: {
        OR: [
          { prevOwnerId: userId },
          { currentOwnerId: userId },
        ],
      },
    });
    res.status(200).json({ success: true, data: transferLands });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createTransferLand, getAllTransferLands, getTransferLandById, getTransferLandsByUser };
