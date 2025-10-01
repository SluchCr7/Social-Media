const Event = require("../Modules/Event");
const { EventPopulate } = require("../Populates/Populate");

// 📌 إنشاء حدث جديد
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      type: req.body.type || "custom",
      createdBy: req.user._id, // يفترض عندك auth middleware
      invitedUsers: req.body.invitedUsers || [],
      repeatYearly: req.body.repeatYearly || false  
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 جلب كل الأحداث
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "username email")
      .populate("invitedUsers", "username email");

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 جلب حدث واحد
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(EventPopulate);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.id; // id المستخدم من الراوت

    // جلب الأحداث التي أنشأها المستخدم أو التي تمت دعوته إليها
    const events = await Event.find({
      $or: [
        { createdBy: userId },             // أحداث من صنعه
        { invitedUsers: userId }           // أحداث تمت دعوته إليها
      ]
    }).populate(EventPopulate).sort({ date: 1 }); // ترتيب حسب التاريخ

    return res.status(200).json({ success: true, events });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


// 📌 تحديث حدث
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event updated", event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 📌 حذف حدث
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
