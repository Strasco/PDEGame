const mongoose = require('mongoose');

const MarketplaceSchema = new mongoose.Schema({
	itemName: {
		type: String,
		required: [ true, 'Please add item name' ]
	},
	itemQuantity: {
		type: Number,
		required: [ true, 'Please add item quantity for sale' ]
	},
	itemCategory: {
		type: String,
		required: [ true, 'Please add item category' ]
	},
	pricePerUnit: {
		type: Number,
		required: [ true, 'Please add price per unit' ]
	},
	soldBy: {
		type: String,
		required: [ true, 'Please add sold by' ]
	}
});

module.exports = mongoose.model('Marketplace', MarketplaceSchema);
