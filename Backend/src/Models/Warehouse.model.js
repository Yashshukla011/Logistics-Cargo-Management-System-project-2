import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
  name:
  { 
    type: String,
     required: true 
    },
  location: 
  { 
    type: String, 
    required: true 
},
  capacity: 
  
  { 
    type: Number, 
    required: true
 },
  currentItems: 
  { 
    type: Number,
     default: 0
}
}, { timestamps: true });

export const WarehouseModel =  mongoose.model("Warehouse", warehouseSchema);