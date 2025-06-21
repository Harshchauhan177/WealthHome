export class Property {
  constructor({
    title,
    description,
    location,
    price,
    type,
    beds,
    baths,
    sqft,
    image_url
  }) {
    this.title = title;
    this.description = description;
    this.location = location;
    this.price = Number(price);
    this.type = type; // 'buy' or 'rent'
    this.beds = Number(beds);
    this.baths = Number(baths);
    this.sqft = Number(sqft);
    this.image_url = image_url;
  }
}

window.Property = Property;
window.properties = []; 