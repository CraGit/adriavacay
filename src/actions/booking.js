"use server";

export async function submitBooking(dateRange, guests, formData) {
  const rawFormData = {
    name: formData.get("name"),
    email: formData.get("email"),
    dateFrom: dateRange.from,
    dateTo: dateRange.to,
    guests,
  };

  console.log(rawFormData);
}
