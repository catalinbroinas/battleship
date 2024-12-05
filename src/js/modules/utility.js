function DomUtilityManager() {
    const clearPageContent = (container) => {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    };

    const createDOMElement = ({
        elementTag,
        elementClass = [],
        elementId,
        elementText,
        elementScope,
        elementAttributes,
        clickHandler
    }) => {
        const element = document.createElement(elementTag);

        if (Array.isArray(elementClass)) {
            elementClass.forEach(className => element.classList.add(className));
        } else {
            console.error('elementClass is not an array:', elementClass);
        }

        if (elementId) {
            element.id = elementId;
        }

        if (elementScope) {
            element.scope = elementScope;
        }

        if (elementAttributes) {
            Object.entries(elementAttributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }

        if (elementText) {
            element.textContent = elementText;
        }

        if (clickHandler) {
            element.addEventListener('click', clickHandler);
        }

        return element;
    };

    const createButton = ({ name, title, buttonClass, iconClass, clickHandler }) => {
        const button = document.createElement('button');

        if (buttonClass) {
            buttonClass.forEach(className => button.classList.add(className));
        }

        if (iconClass) {
            const buttonIcon = document.createElement('i');
            iconClass.forEach(className => buttonIcon.classList.add(className));

            button.appendChild(buttonIcon);
            if (name) {
                button.insertAdjacentText('beforeend', name);
            }
        } else {
            button.textContent = name;
        }

        button.setAttribute('type', 'button');
        if (title) {
            button.setAttribute('title', title);
        }

        if (clickHandler) {
            button.addEventListener('click', clickHandler);
        }

        return button;
    };

    // Add ripple effect to buttons
    const rippleEffect = (btn) => {
        const ripple = document.createElement("span");

        ripple.classList.add("ripple");

        btn.appendChild(ripple);

        // Get position of X
        const x = btn.clientX - btn.offsetLeft;

        // Get position of Y 
        const y = btn.clientY - btn.offsetTop;

        // Position the span element 
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Remove span after 0.3s 
        setTimeout(() => {
            ripple.remove();
        }, 300);
    };

    return {
        clearPageContent,
        createDOMElement,
        createButton,
        rippleEffect
    };
}

function StringUtilityManager() {
    const capitalizeFirstLetter = (string) => {
        if (!string) return;
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return {
        capitalizeFirstLetter
    };
}

export { DomUtilityManager, StringUtilityManager };
