class Property {
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
    this.id = (window.crypto && window.crypto.randomUUID) ? window.crypto.randomUUID() : Property.fallbackUUID();
    this.title = title;
    this.description = description;
    this.location = location;
    this.price = Number(price);
    this.type = type; // 'buy' or 'rent'
    this.beds = Number(beds);
    this.baths = Number(baths);
    this.sqft = Number(sqft);
    this.image_url = image_url;
    this.created_at = new Date().toISOString();
  }
  static fallbackUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

window.Property = Property;
window.properties = []; 