const { Op } = require("sequelize");
const Showtime = require("../models/Showtime");

const isSlotAvailable = async (
  screenId,
  showDate,
  startTime,
  endTime,
  showtimeId = null
) => {
  try {
    const whereCondition = {
      screenId,
      showDate,
      status: "Active",
      [Op.or]: [
        // Existing show starts during new show
        {
          startTime: {
            [Op.gt]: startTime,
            [Op.lt]: endTime,
          },
        },

        // Existing show ends during new show
        {
          endTime: {
            [Op.gt]: startTime,
            [Op.lt]: endTime,
          },
        },

        // Existing show completely covers new show
        {
          startTime: {
            [Op.lte]: startTime,
          },
          endTime: {
            [Op.gte]: endTime,
          },
        },

        // New show completely covers existing show
        {
          startTime: {
            [Op.gte]: startTime,
          },
          endTime: {
            [Op.lte]: endTime,
          },
        },
      ],
    };

    // Ignore current show during update
    if (showtimeId) {
      whereCondition.showtimeId = {
        [Op.ne]: showtimeId,
      };
    }

    const existingShow = await Showtime.findOne({
      where: whereCondition,
    });

    return !existingShow;
  } catch (error) {
    throw error;
  }
};

module.exports = isSlotAvailable;