import Notification from '../models/Notification.js';

// Store io instance
let ioInstance = null;
let userSocketsMap = null;

export const initNotificationService = (io, userSockets) => {
    ioInstance = io;
    userSocketsMap = userSockets;
};

// Create and emit notification
export const createNotification = async ({ userId, type, title, message, link, relatedId }) => {
    try {
        // Create notification in database
        const notification = await Notification.create({
            user: userId,
            type,
            title,
            message,
            link,
            relatedId
        });

        // Emit real-time notification via Socket.IO
        if (ioInstance && userSocketsMap) {
            const socketId = userSocketsMap.get(userId.toString());
            if (socketId) {
                ioInstance.to(socketId).emit('notification', {
                    ...notification.toObject(),
                    _id: notification._id.toString()
                });
            }
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Helper functions for specific notification types
export const notifyNewProposal = async (jobOwnerId, freelancerName, jobTitle, jobId, proposalId) => {
    return createNotification({
        userId: jobOwnerId,
        type: 'proposal',
        title: 'New Proposal Received',
        message: `${freelancerName} submitted a proposal for "${jobTitle}"`,
        link: `/jobs/${jobId}/proposals`,
        relatedId: proposalId
    });
};

export const notifyNewMessage = async (receiverId, senderName, conversationId) => {
    return createNotification({
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `${senderName} sent you a message`,
        link: `/messages?conversation=${conversationId}`,
        relatedId: conversationId
    });
};

export const notifyDeliverable = async (clientId, freelancerName, contractTitle, contractId, deliverableId) => {
    return createNotification({
        userId: clientId,
        type: 'contract',
        title: 'Deliverable Submitted',
        message: `${freelancerName} submitted a deliverable for "${contractTitle}"`,
        link: `/contracts/${contractId}`,
        relatedId: deliverableId
    });
};

export const notifyProposalAccepted = async (freelancerId, clientName, jobTitle, contractId) => {
    return createNotification({
        userId: freelancerId,
        type: 'contract',
        title: 'Proposal Accepted!',
        message: `${clientName} accepted your proposal for "${jobTitle}"`,
        link: `/contracts/${contractId}`,
        relatedId: contractId
    });
};

export const notifyContractCompleted = async (freelancerId, contractTitle, contractId) => {
    return createNotification({
        userId: freelancerId,
        type: 'contract',
        title: 'Contract Completed',
        message: `Contract "${contractTitle}" has been marked as completed`,
        link: `/contracts/${contractId}`,
        relatedId: contractId
    });
};

export const notifyPayment = async (userId, amount, contractTitle, contractId) => {
    return createNotification({
        userId,
        type: 'payment',
        title: 'Payment Received',
        message: `You received $${amount} for "${contractTitle}"`,
        link: `/contracts/${contractId}`,
        relatedId: contractId
    });
};

export const notifyReview = async (userId, reviewerName, rating, contractId) => {
    return createNotification({
        userId,
        type: 'review',
        title: 'New Review',
        message: `${reviewerName} left you a ${rating}-star review`,
        link: `/dashboard`,
        relatedId: contractId
    });
};
