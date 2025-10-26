// app/utils/api.js
export const api = async (url, method = "GET", data, isFormData = false) => {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";

  const options = {
    method,
    headers,
    credentials: "include", // في حالة وجود auth cookies
  };

  if (data) {
    options.body = isFormData ? data : JSON.stringify(data);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, options);
  const result = await response.json();

  if (!response.ok) throw new Error(result.message || "حدث خطأ في السيرفر");
  return result;
};
