import React, { useEffect, useState } from "react";
import axios from "axios";

const DynamicForm = ({ apiUrl }) => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchFormFields() {
      try {
        const res = await axios.get(apiUrl);
        const rawFields = res.data?.data?.fields?.flat() || [];

        // Set default values for formData
        const initialData = {};
        rawFields.forEach((field) => {
          initialData[field.fieldId] = field.fieldType === "checkbox" ? false : "";
        });

        setFields(rawFields);
        setFormData(initialData);
      } catch (error) {
        console.error("Failed to fetch form fields:", error);
      }
    }

    fetchFormFields();
  }, [apiUrl]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field.fieldId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const renderField = (field) => {
    const props = field.properties || {};
    const id = field.fieldId;
    const label = props.label || field.fieldName;
    const placeholder = props.placeholder || "";
    const required = props.required || false;

    switch (field.fieldType) {
      case "text":
      case "number":
      case "date":
      case "fixed_time":
        return (
          <input
            type={field.fieldType === "fixed_time" ? "time" : field.fieldType}
            id={id}
            value={formData[id]}
            required={required}
            placeholder={placeholder}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );

      case "radio":
        return props.options?.map((option, idx) => (
          <label key={idx}>
            <input
              type="radio"
              name={id}
              value={option}
              checked={formData[id] === option}
              onChange={() => handleChange(field, option)}
            />
            {option}
          </label>
        ));

      case "checkbox":
        return (
          <input
            type="checkbox"
            id={id}
            checked={formData[id]}
            onChange={(e) => handleChange(field, e.target.checked)}
          />
        );

      case "dropdown":
        return (
          <select
            id={id}
            value={formData[id]}
            onChange={(e) => handleChange(field, e.target.value)}
            required={required}
          >
            <option value="">Select...</option>
            {props.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multiple":
        return (
          <select
            multiple
            id={id}
            value={formData[id] || []}
            onChange={(e) =>
              handleChange(
                field,
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
          >
            {props.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "weekdays":
        const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
        return (
          <select
            id={id}
            value={formData[id]}
            onChange={(e) => handleChange(field, e.target.value)}
          >
            <option value="">Select weekday</option>
            {weekdays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            id={id}
            value={formData[id]}
            placeholder={placeholder}
            required={required}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => {
        const label =
          field?.properties?.fieldLabelProperties?.fieldLabel ||
          field?.properties?.label ||
          field.fieldName;
        return (
          <div key={field.fieldId} style={{ marginBottom: "1rem" }}>
            {label && <label htmlFor={field.fieldId}>{label}</label>}
            <br />
            {renderField(field)}
          </div>
        );
      })}
      <button type="submit">Submit</button>
    </form>
  );
};
export default DynamicForm;