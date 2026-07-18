addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 0,
    symbol() {return ''}, // This appears on the layer's node. Default is the id with the first letter capitalized
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['po'])},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

addLayer("po", {
    name: "points", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Points", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 0, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#ffffff",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
    ],
    layerShown() { return true },
    buyables: {
    11: {
        cost(x) { return new Decimal(10).mul(Decimal.pow(1.15, x)) },
        display() { return format(this.cost()) + " " + modInfo.pointsName + "<br>" },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) { return Decimal.mul(this.base(), x)},
        base() {
            let base = new Decimal(1)
            return base
        }
    },
    }
})

