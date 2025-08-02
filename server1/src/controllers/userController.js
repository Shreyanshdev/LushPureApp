
import { Customer } from "../models/user.js";
import Subscription from "../models/subscription.js";

export const getUserProfile = async (req, reply) => {
  try {
    const userId = req.user._id;
    console.log('Decoded userId:', userId);

    const user = await Customer.findById(userId).lean();
    console.log('User found:', user);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    // Get the latest active or recent subscription for the user
    const subscription = await Subscription.findOne({ customer: userId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return reply.send({
      name: user.name,
      phone: user.phone,
      address: user.address,
      isActivated: user.isActivated,
      subscription: subscription
        ? {
            id: subscription._id,
            status: subscription.status,
            milkType: subscription.milkType,
            slot: subscription.slot,
            quantity: subscription.quantity,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
          }
        : null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateUserProfile = async (req, reply) => {
    try {
      const userId = req.user._id;
      const { name, email, address } = req.body;
  
      const user = await Customer.findById(userId);
  
      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }
  
      if (name) user.name = name;
      if (email) user.email = email;
      if (address) user.address = address;
  
      await user.save();
  
      return reply.send({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Profile update error:", error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  };
