export const removeTypeDescriptors = (item) => {
  if (!item || typeof item !== "object") {
    return item;
  }

  for (const key in item) {
    if (item.hasOwnProperty(key)) {
      if (item[key] && item[key].hasOwnProperty("S")) {
        item[key] = item[key].S;
      } else if (item[key] && item[key].hasOwnProperty("N")) {
        item[key] = parseFloat(item[key].N); // Assuming it's a number
      } else if (item[key] && item[key].hasOwnProperty("B")) {
        item[key] = Buffer.from(item[key].B, "base64"); // Assuming it's binary
      } else if (Array.isArray(item[key])) {
        item[key] = item[key].map(removeTypeDescriptors);
      } else if (typeof item[key] === "object") {
        item[key] = removeTypeDescriptors(item[key]);
      }
    }
  }

  return item;
};
