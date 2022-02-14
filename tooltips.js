class Tooltip {
    constructor(element) {
        this.container = element
        this.button = element.querySelector('button')
        this.tooltip = element.querySelector('[role=tooltip]')
        this.globalEscapeBound = this.globalEscape.bind(this)
        this.globalPointerDownBound = this.globalPointerDown.bind(this)
        this.bindEvents()
    }
    
    bindEvents() {
        // Events that trigger open()
        // Open on mouse hover
        this.container.addEventListener('mouseenter', this.open.bind(this))
        // Open when a touch is detected
        this.container.addEventListener('touchstart', this.open.bind(this))
        // Open when the button gets focus
        this.button.addEventListener('focus', this.open.bind(this))

        // Events that trigger close()
        // Close when the mouse cursor leaves the button or tooltip area
        this.container.addEventListener('mouseleave', this.close.bind(this))
        // Close when the buttons loses focus
        this.button.addEventListener('blur', this.close.bind(this))
    }
    
    open() {
        this.showTooltip()
        this.attachGlobalListener()
    }
    
    close() {
        this.hideTooltip()
        this.removeGlobalListener()
    }
    
    attachGlobalListener() {
        document.addEventListener('keydown', this.globalEscapeBound)
        document.addEventListener('pointerdown', this.globalPointerDownBound)
    }
    
    removeGlobalListener() {
        document.removeEventListener('keydown', this.globalEscapeBound)
        document.removeEventListener('pointerdown', this.globalPointerDownBound)
    }
    
    globalEscape(event) {
        if (event.key === 'Escape' || event.key === 'Esc') {
            this.close()
        }
    }
    
    // Close the tooltip if the target is anything other than the components within the tooltip widget
    globalPointerDown(event) {
        switch (event.target) {
            case this.container:
            case this.button:
            case this.tooltip:
                event.preventDefault()
                break
            default:
                this.close()
                this.button.blur()
        }
    }
    
    showTooltip() {
        this.container.classList.add('tooltip-visible')
        this.tooltip.classList.remove('hidden')
        this.checkBoundingBox()
    }
    
    hideTooltip() {
        this.container.classList.remove('tooltip-visible')
        this.tooltip.classList.add('hidden')
        this.resetBoundingBox()
    }

    checkBoundingBox() {
        let windowWidth = window.innerWidth
        let bounds = this.tooltip.getBoundingClientRect()

        if (bounds.right > windowWidth) {
            this.moveTooltipLeft(bounds, windowWidth)
        } else if (bounds.left < 0 ) {
            this.moveTooltipRight(bounds)
        }
    }
    
    moveTooltipLeft(bounds, windowWidth) {
        let translateAmount = (windowWidth - Math.round(bounds.right) - (Math.round(bounds.width) / 1.6))
        this.tooltip.style.transform = `translateX(${translateAmount}px)`
    }
    
    moveTooltipRight(bounds) {
        let numToMove = Math.floor(bounds.width / 2)
        this.tooltip.style.left = `${numToMove}px`
    }

    resetBoundingBox() {
        if (this.tooltip.style.left || this.tooltip.style.transform) {
            this.tooltip.style.left = null
            this.tooltip.style.transform = null
        }
    }
}

Array.from(document.querySelectorAll('.tooltip-container')).forEach(element => new Tooltip(element))
