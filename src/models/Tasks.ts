import mongoose from 'mongoose'

const TasksSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  state: { type: Boolean, default: false },
  date: { type: Date, default: Date.now() },
  priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
}, {
  timestamps: true
})

const Tasks = mongoose.model('Tasks', TasksSchema)
export default Tasks