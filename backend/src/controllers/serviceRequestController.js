const pool = require("../db");
const sendEmail = require("../utils/sendEmail");

const submitRequest = async (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, serviceType, message } =
      req.body;
    const request = await pool.query(
      `
            INSERT INTO service_requests(company_name,contact_person,email,phone,service_type,message)
            VALUES($1,$2,$3,$4,$5,$6)`,
      [companyName, contactPerson, email, phone, serviceType, message],
    );

    await sendEmail(
      process.env.EMAIL_USER,
      "New service from" + companyName,
      `
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Contact:</strong> ${contactPerson}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${serviceType}</p>
        <p><strong>Message:</strong> ${message}</p>`,
    );
    res.status(201).json({ message: "Request sent" });
  } catch (emailError) {
    console.error("Email failed:", emailError.message);
  }
};

const getAllRequest = async (req, res) => {
  try {
    const Allrequest = await pool.query(`
            SELECT * FROM service_requests`);

    if (!Allrequest) {
      return res.status(404).json({ message: "Requests not found" });
    }
    res.json(Allrequest.rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error, Failed to fetch requests" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const UpdateStatus = await pool.query(
      `
            UPDATE service_requests SET status=$1 WHERE id=$2
            
            RETURNING *`,
      [status, req.params.id],
    );
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error. Failed to update status" });
  }
};

module.exports = { submitRequest, getAllRequest, updateRequestStatus };
