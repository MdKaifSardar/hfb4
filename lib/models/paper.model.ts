import { Schema, model, models } from 'mongoose';

const PaperSchema = new Schema({
    userId: { type: String, required: true },
    summary: { type: String, required: true },
    pdf: {
        url: { type: String, required: true },
        id: { type: String, required: true }
    }
}, { timestamps: true });

export const Paper = models.Paper || model('Paper', PaperSchema);
