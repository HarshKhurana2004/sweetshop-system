const sweetsService = require('../services/sweets.service');

exports.add = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;

    await sweetsService.add(name, category, price, quantity);

    return res.status(201).json({
      message: "Sweet added successfully"
    });

  } catch (error) {
    console.log("Sweet Add Error:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const sweets = await sweetsService.getAll();
    return res.status(200).json(sweets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.search = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const results = await sweetsService.search(name, category, minPrice, maxPrice);
    return res.status(200).json(results);

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    const sweetId = req.params.id;
    const { name, category, price, quantity } = req.body;

    await sweetsService.update(sweetId, name, category, price, quantity);

    return res.status(200).json({ message: "Sweet updated successfully" });

  } catch (error) {
    console.log("UPDATE ERROR:", error.message);   // <-- ADD THIS
    return res.status(400).json({ error: error.message });
  }
};
exports.delete = async (req, res) => {
  try {
    const sweetId = req.params.id;

    await sweetsService.delete(sweetId);

    return res.status(200).json({ message: "Sweet deleted successfully" });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
exports.purchase = async (req, res) => {
  try {
    console.log("PURCHASE ID RECEIVED:", req.params.id);  // <--- ADD THIS

    const sweetId = req.params.id;

    await sweetsService.purchase(sweetId);

    return res.status(200).json({ message: "Sweet purchased successfully" });

  } catch (error) {
    console.log("PURCHASE ERROR:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
exports.restock = async (req, res) => {
  try {
    console.log("RESTOCK ID RECEIVED:", req.params.id);
    console.log("RESTOCK BODY:", req.body);

    const sweetId = req.params.id;
    const amount = req.body.amount || 1;

    await sweetsService.restock(sweetId, amount);

    return res.status(200).json({ message: "Sweet restocked successfully" });

  } catch (error) {
    console.log("RESTOCK ERROR:", error.message);
    return res.status(400).json({ error: error.message });
  }
};
