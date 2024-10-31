import { backend } from "declarations/backend";

class WebsiteBuilder {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.selectedElement = null;
        this.components = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Drag and drop setup
        const components = document.querySelectorAll('.component');
        components.forEach(comp => {
            comp.addEventListener('dragstart', this.handleDragStart.bind(this));
        });

        this.canvas.addEventListener('dragover', this.handleDragOver.bind(this));
        this.canvas.addEventListener('drop', this.handleDrop.bind(this));

        // Save and load buttons
        document.getElementById('saveBtn').addEventListener('click', this.saveLayout.bind(this));
        document.getElementById('loadBtn').addEventListener('click', this.loadLayout.bind(this));

        // Canvas click handler
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectAll();
            }
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    async handleDrop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const component = {
            type,
            id: Date.now().toString(),
            x,
            y,
            content: this.getDefaultContent(type),
            styles: this.getDefaultStyles(type)
        };

        await this.addComponent(component);
    }

    getDefaultContent(type) {
        switch(type) {
            case 'heading':
                return 'New Heading';
            case 'text':
                return 'New Text Block';
            case 'image':
                return 'https://via.placeholder.com/150';
            default:
                return '';
        }
    }

    getDefaultStyles(type) {
        return {
            fontSize: type === 'heading' ? '24px' : '16px',
            color: '#000000',
            backgroundColor: 'transparent',
            padding: '10px'
        };
    }

    async addComponent(component) {
        this.showLoading();
        try {
            await backend.addComponent(component);
            this.components.push(component);
            this.renderComponent(component);
        } catch (error) {
            console.error('Error adding component:', error);
        }
        this.hideLoading();
    }

    renderComponent(component) {
        const element = document.createElement('div');
        element.className = 'canvas-element';
        element.id = component.id;
        element.style.left = `${component.x}px`;
        element.style.top = `${component.y}px`;
        
        switch(component.type) {
            case 'heading':
                element.innerHTML = `<h2>${component.content}</h2>`;
                break;
            case 'text':
                element.innerHTML = `<p>${component.content}</p>`;
                break;
            case 'image':
                element.innerHTML = `<img src="${component.content}" alt="Component image">`;
                break;
        }

        Object.assign(element.style, component.styles);
        
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element, component);
        });

        this.canvas.appendChild(element);
    }

    selectElement(element, component) {
        this.deselectAll();
        element.classList.add('selected');
        this.selectedElement = { element, component };
        this.showPropertyEditor(component);
    }

    deselectAll() {
        document.querySelectorAll('.canvas-element').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
        this.clearPropertyEditor();
    }

    showPropertyEditor(component) {
        const editor = document.getElementById('propertyEditor');
        editor.innerHTML = '';

        // Content editor
        const contentInput = this.createInput('text', 'Content', component.content);
        contentInput.addEventListener('change', async (e) => {
            component.content = e.target.value;
            await this.updateComponent(component);
        });
        editor.appendChild(contentInput);

        // Style editors
        Object.entries(component.styles).forEach(([style, value]) => {
            const input = this.createInput('text', style, value);
            input.addEventListener('change', async (e) => {
                component.styles[style] = e.target.value;
                await this.updateComponent(component);
            });
            editor.appendChild(input);
        });
    }

    createInput(type, label, value) {
        const div = document.createElement('div');
        div.className = 'property-input';
        
        const labelElement = document.createElement('label');
        labelElement.textContent = label.charAt(0).toUpperCase() + label.slice(1);
        
        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        
        div.appendChild(labelElement);
        div.appendChild(input);
        return div;
    }

    clearPropertyEditor() {
        document.getElementById('propertyEditor').innerHTML = '';
    }

    async updateComponent(component) {
        this.showLoading();
        try {
            await backend.updateComponent(component);
            const element = document.getElementById(component.id);
            if (element) {
                switch(component.type) {
                    case 'heading':
                        element.querySelector('h2').textContent = component.content;
                        break;
                    case 'text':
                        element.querySelector('p').textContent = component.content;
                        break;
                    case 'image':
                        element.querySelector('img').src = component.content;
                        break;
                }
                Object.assign(element.style, component.styles);
            }
        } catch (error) {
            console.error('Error updating component:', error);
        }
        this.hideLoading();
    }

    async saveLayout() {
        this.showLoading();
        try {
            await backend.saveLayout(this.components);
            alert('Layout saved successfully!');
        } catch (error) {
            console.error('Error saving layout:', error);
            alert('Error saving layout');
        }
        this.hideLoading();
    }

    async loadLayout() {
        this.showLoading();
        try {
            const layout = await backend.loadLayout();
            this.canvas.innerHTML = '';
            this.components = layout;
            layout.forEach(component => this.renderComponent(component));
        } catch (error) {
            console.error('Error loading layout:', error);
            alert('Error loading layout');
        }
        this.hideLoading();
    }

    showLoading() {
        document.getElementById('loadingSpinner').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('active');
    }
}

// Initialize the website builder
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteBuilder();
});
