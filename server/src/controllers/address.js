import Address from "../models/address.js";

export const addAddress = async (req, reply) => {
    try {
        const { userId, addressLine1, addressLine2, city, state, zipCode, isDefault } = req.body;
        const newAddress = new Address({
            userId,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            isDefault,
        });
        await newAddress.save();
        return reply.status(201).send({ message: "Address added successfully", address: newAddress });
    } catch (error) {
        console.error("Error adding address:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const getAddresses = async (req, reply) => {
    try {
        const { userId } = req.user; // Assuming userId is available from verifyToken
        const addresses = await Address.find({ userId });
        return reply.status(200).send(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const updateAddress = async (req, reply) => {
    try {
        const { addressId } = req.params;
        const { addressLine1, addressLine2, city, state, zipCode, isDefault } = req.body;
        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            { addressLine1, addressLine2, city, state, zipCode, isDefault },
            { new: true }
        );
        if (!updatedAddress) {
            return reply.status(404).send({ message: "Address not found" });
        }
        return reply.status(200).send({ message: "Address updated successfully", address: updatedAddress });
    } catch (error) {
        console.error("Error updating address:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};

export const deleteAddress = async (req, reply) => {
    try {
        const { addressId } = req.params;
        const deletedAddress = await Address.findByIdAndDelete(addressId);
        if (!deletedAddress) {
            return reply.status(404).send({ message: "Address not found" });
        }
        return reply.status(200).send({ message: "Address deleted successfully" });
    } catch (error) {
        console.error("Error deleting address:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
};
