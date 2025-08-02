import Subscription from "../../models/subscription.js";

export const createSubscription = async (req, reply) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    return reply.code(201).send(subscription); // ✅ return
  } catch (error) {
    return reply.code(400).send({ message: error.message }); // ✅ return
  }
};

export const getSubscription = async (req, reply) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate("customer product");
    if (!subscription) {
      return reply.code(404).send({ message: "Subscription not found" }); // ✅ return
    }
    return reply.code(200).send(subscription); // ✅ return
  } catch (error) {
    return reply.code(400).send({ message: error.message }); // ✅ return
  }
};

export const updateSubscription = async (req, reply) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subscription) {
      return reply.code(404).send({ message: "Subscription not found" }); // ✅ return
    }
    return reply.code(200).send(subscription); // ✅ return
  } catch (error) {
    return reply.code(400).send({ message: error.message }); // ✅ return
  }
};

export const cancelSubscription = async (req, reply) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return reply.code(404).send({ message: "Subscription not found" }); // ✅ return
    }

    const now = new Date();
    const nextDelivery = new Date(); // This needs to be calculated based on the subscription's schedule
    nextDelivery.setDate(now.getDate() + 1); // For simplicity, next delivery is tomorrow

    const cutoff = new Date(nextDelivery.getTime() - subscription.cancellationCutoff * 60 * 60 * 1000);

    if (now > cutoff) {
      return reply.code(400).send({ 
        message: `You can only cancel the subscription ${subscription.cancellationCutoff} hours before the next delivery.` 
      }); // ✅ return
    }

    subscription.status = "Cancelled";
    await subscription.save();

    return reply.code(200).send({ message: "Subscription cancelled successfully" }); // ✅ return
  } catch (error) {
    return reply.code(400).send({ message: error.message }); // ✅ return
  }
};
