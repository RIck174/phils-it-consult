const pool = require("../db");

const getAllServices = async (req, res) => {
  try {
    const getServices = await pool.query(`
            SELECT * FROM services ORDER BY id ASC`);

    res.json(getServices.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

const AddNewService = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    const newService = await pool.query(
      `
            INSERT INTO services (name,description,image_url)
            VALUES($1,$2,$3)`,
      [name, description, image_url],
    );

    res.status(201).json({ message: "New Service added" });
  } catch (error) {
    res.status(500).json({ message: "Failed to create new service" });
  }
};

const updateService = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    const updated = await pool.query(
      `
            UPDATE services SET 
            name=$1,
            description=$2,
            image_url=$3  WHERE id= $4
            
            RETURNING *`,
      [name, description, image_url, req.params.id],
    );

    res.status(200).json({ message: "Update succesful" });
  } catch (error) {
    res.status(500).json({ message: "Error. Failed to update services" });
  }
};

const deleteService = async (req, res) => {
  try {
    const delete_Service = await pool.query(
      `
            DELETE FROM services WHERE id=$1`,
      [req.params.id],
    );

    res.status(200).json({ message: "Service successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};

module.exports = {
  getAllServices,
  AddNewService,
  updateService,
  deleteService,
};
