import Test from '../model/test.js';

export const createTest = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;
    if (!name || !price) return res.status(400).json({ success: false, message: 'Name and price are required' });
    const test = await Test.create({ name, description, price, isActive });
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json({ success: true, data: tests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateTest = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { name, description, price, isActive, updatedAt: Date.now() },
      { new: true }
    );
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, message: 'Test deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
