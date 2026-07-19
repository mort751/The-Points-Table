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
    name: "Point", // This is optional, only used in a few places, If absent it just uses the layer id
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
       "buyables"
    ],
    layerShown() { return true },
    buyables: {
    11: {
        description: "Increases base point generation.",
        title() { return tmp[this.layer].name + " Upgrade " + this.id + " (" + getBuyableAmount(this.layer, this.id) + ")" },
        cost(x) { return new Decimal(10).mul(Decimal.pow(1.25, x)) },
        display() { return this.description + "<br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>Effect: " + this.effectDisplay() },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) { return Decimal.mul(this.base(), x)},
        base() {
            let base = new Decimal(1)
            return base
        },
        effectDisplay() { return "+" + format(this.effect()) + " (+" + format(this.base()) + " each)" },
        unlocked() { return true }
    },
    12: {
        description: "Multiplies point generation.",
        title() { return tmp[this.layer].name + " Upgrade " + this.id + " (" + getBuyableAmount(this.layer, this.id) + ")" },
        cost(x) { return new Decimal(200).mul(Decimal.pow(2.5, x.pow(1.35))) },
        display() { return this.description + "<br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>Effect: " + this.effectDisplay() },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) { return Decimal.pow(this.base(), x)},
        base() {
            let base = new Decimal(2)
            base = base.add(buyableEffect(this.layer, 13))
            return base
        },
        effectDisplay() { return "" + format(this.effect()) + "x (" + format(this.base()) + "x each)" },
        unlocked() { return getBuyableAmount(this.layer,  11).gt(0) }
    },
    13: {
        description: "Increases PU11's base.",
        title() { return tmp[this.layer].name + " Upgrade " + this.id + " (" + getBuyableAmount(this.layer, this.id) + ")" },
        cost(x) { return new Decimal(10000).mul(Decimal.pow(x.sub(1).max(0).mul(x.add(1)).add(3), x)) },
        display() { return this.description + "<br>Cost: " + format(this.cost()) + " " + modInfo.pointsName + "<br>Effect: " + this.effectDisplay() },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) { return Decimal.mul(this.base(), x)},
        base() {
            let base = new Decimal(1)
            return base
        },
        effectDisplay() { return "+" + format(this.effect()) + " (+" + format(this.base()) + " each)" },
        unlocked() { return getBuyableAmount(this.layer,  12).gt(0) }
    },
    }
})

addLayer("mu", {
    name: "Multiplier", // This is optional, only used in a few places, If absent it just uses the layer id
    symbol: "Multiplier Points", // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    row: 1, // Row the layer is in on the tree (0 is the first row)
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#e42a2a",
    requires: new Decimal("1e30"), // Can be a function that takes requirement increases into account
    resource: "Multiplier Points", // Name of prestige currency
    baseResource: "Points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: Decimal.div(7, 6), // Prestige currency exponent
    base: new Decimal('1e6'),
    canBuyMax() { return true },
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "main-display",
       "prestige-button",
       "blank",
       "milestones",
       "blank",
       "buyables"
    ],
    layerShown() { return getBuyableAmount('po', 13).gte(10) || player[this.layer].unlocked },
    effect() { return player.mu.points.add(tmp[this.layer].baseEffect) },
    baseEffect() {
        let base = new Decimal(1)
        if(hasMilestone(this.layer, 1)) base = base.add(buyableEffect(this.layer, 11))
        return base
    },
    effectDescription() { return "which are multiplying point gain by " + format(tmp[this.layer].effect) + "x (+" + format(tmp[this.layer].baseEffect) + " each)" },
    milestones: {
    1: {
        requirementDescription: "2 Multiplier Points",
        effectDescription: "Unlock 3 new Point Upgrades, and a Multiplier Point Upgrade",
        done() { return player[this.layer].points.gte(2) },
        unlocked() { return player[this.layer].points.gte(1) },
    },
    },
    buyable: {
        11: {
        description: "Increases the effect increase per Multiplier Point.",
        title() { return tmp[this.layer].name + " Upgrade " + this.id + " (" + getBuyableAmount(this.layer, this.id) + ")" },
        cost(x) { return new Decimal(10).mul(Decimal.pow(1.25, x)) },
        display() { return this.description + "<br>Cost: " + format(this.cost()) + " " + tmp[this.layer].resource + "<br>Effect: " + this.effectDisplay() },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect(x) { return Decimal.mul(this.base(), x)},
        base() {
            let base = new Decimal(1)
            return base
        },
        effectDisplay() { return "+" + format(this.effect()) + " (+" + format(this.base()) + " each)" },
        unlocked() { return hasMilestone(this.layer, 1) }
        },
    }
})

