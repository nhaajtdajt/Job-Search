// const JobService = require("../services/jobService");
// const { HTTP_STATUS } = require("../utils/constants");

// class JobController {
//   static async getJobs(req, res, next) {
//     try {
//       const page = req.query.page ? parseInt(req.query.page, 10) : 1;
//       const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

//       if (Number.isNaN(page) || page < 1) {
//         return res.status(HTTP_STATUS.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid page (must be a positive integer)",
//         });
//       }

//       if (Number.isNaN(limit) || limit < 1) {
//         return res.status(HTTP_STATUS.BAD_REQUEST).json({
//           success: false,
//           message: "Invalid limit (must be a positive integer)",
//         });
//       }

//       const filters = {};
//       if (req.query.job_type) filters.job_type = req.query.job_type;
//       if (req.query.employer_id) filters.employer_id = req.query.employer_id;

//       const result = await JobService.getJobs(page, limit, filters);

//       return res.status(HTTP_STATUS.OK).json({
//         success: true,
//         data: result,
//       });
//     } catch (error) {
//       return next(error);
//     }
//   }

//   static async getJobById(req, res, next) {
//     try {
//       const { jobId } = req.params;
//       const data = await JobService.getJobById(jobId);

//       return res.status(HTTP_STATUS.OK).json({
//         success: true,
//         data,
//       });
//     } catch (error) {
//       return next(error);
//     }
//   }
// }

// module.exports = JobController;
