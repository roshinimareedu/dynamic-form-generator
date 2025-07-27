import React, { useEffect, useState } from "react";
import axios from "axios";

const DynamicForm = ({ apiUrl }) => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  // Fetch form fields when API URL changes
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(apiUrl);
        const fieldGroups = response.data.data.fields;
        const flatFields = fieldGroups.flat(); // Flatten the 2D array
        setFields(flatFields);
      } catch (error) {
        console.error("Error fetching form fields:", error);
      }
    };

    fetchFields();
  }, [apiUrl]);

  // Handle input changes
  const handleChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };

  // Render fields based on type
  const renderField = (field) => {
    const { fieldType, fieldUniqueKey, properties } = field;
    const { placeholder, label, options } = properties;

    switch (fieldType) {
      case "radio":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            {options.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={fieldUniqueKey}
                  value={opt}
                  onChange={() => handleChange(fieldUniqueKey, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "dropdown":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            <select
              onChange={(e) => handleChange(fieldUniqueKey, e.target.value)}
            >
              <option value="">-- Select --</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );

      case "date":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            <input
              type="date"
              placeholder={placeholder}
              onChange={(e) => handleChange(fieldUniqueKey, e.target.value)}
            />
          </div>
        );

      case "number":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            <input
              type="number"
              placeholder={placeholder}
              onChange={(e) => handleChange(fieldUniqueKey, e.target.value)}
            />
          </div>
        );

      case "multiple":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            {options.map((opt) => (
              <label key={opt}>
                <input
                  type="checkbox"
                  value={opt}
                  onChange={(e) => {
                    const valueArray = formData[fieldUniqueKey] || [];
                    if (e.target.checked) {
                      handleChange(fieldUniqueKey, [...valueArray, opt]);
                    } else {
                      handleChange(
                        fieldUniqueKey,
                        valueArray.filter((v) => v !== opt)
                      );
                    }
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            <input
              type="checkbox"
              onChange={(e) => handleChange(fieldUniqueKey, e.target.checked)}
            />
          </div>
        );

      case "fixed_time":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            <input
              type="time"
              onChange={(e) => handleChange(fieldUniqueKey, e.target.value)}
            />
          </div>
        );

      case "weekdays":
        return (
          <div key={fieldUniqueKey}>
            <label>{label}</label>
            <select
              onChange={(e) => handleChange(fieldUniqueKey, e.target.value)}
            >
              <option value="">-- Select Day --</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    alert("Form submitted! Check console.");
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => renderField(field))}
      <button type="submit">Submit</button>
    </form>
  );
};
export default DynamicForm;
