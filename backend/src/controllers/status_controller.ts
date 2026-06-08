import { Response, NextFunction } from "express";
import ApplicationService from "../services/application_services.js";
import { AuthenticatedRequest } from "../middlewares/auth_middleware.js";

export const updateStatus = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const idParam = (req.params as any).id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    const { status } = req.body;

    
  
    const result = await ApplicationService.updateApplicationStatus(id, status);
    
    res.status(200).json({ 
      status: "success", 
      message: "Cập nhật trạng thái thành công", 
      data: result 
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};