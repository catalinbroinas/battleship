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

    return {
        clearPageContent,
        createDOMElement,
        createButton
    };
}

export { DomUtilityManager };
