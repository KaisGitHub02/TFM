class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 17;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigation();
    }
    
    cacheDOMElements() {
        // Elementos principales
        this.slidesContainer = document.getElementById('slidesContainer');
        this.slides = document.querySelectorAll('.slide');
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.querySelector('.main-content');
        
        // Botones de navegación
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        
        // Indicadores
        this.progressBar = document.getElementById('progressBar');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        // Enlaces de navegación del sidebar
        this.navLinks = document.querySelectorAll('.nav-list a');
    }
    
    bindEvents() {
        // Navegación con botones
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Toggle del sidebar
        this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        
        // Navegación desde el sidebar
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const slideNumber = parseInt(link.dataset.slide);
                this.goToSlide(slideNumber);
                this.closeSidebar();
            });
        });
        
        // Cerrar sidebar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.sidebar.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeSidebar();
            }
        });
        
        // Atajos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevenir scroll accidental
        document.addEventListener('wheel', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Gestos táctiles para móvil
        this.setupTouchEvents();
        
        // Redimensionar ventana
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        this.slidesContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        this.slidesContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Solo procesar si el movimiento horizontal es mayor que el vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        });
    }
    
    handleKeyboard(e) {
        // Prevenir acción si estamos escribiendo en algún input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Barra espaciadora
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.closeSidebar();
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                this.toggleSidebar();
                break;
        }
        
        // Navegación directa con números
        if (e.key >= '1' && e.key <= '9') {
            const slideNumber = parseInt(e.key);
            if (slideNumber <= this.totalSlides) {
                e.preventDefault();
                this.goToSlide(slideNumber);
            }
        }
    }
    
    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;
        
        this.goToSlide(this.currentSlide + 1);
    }
    
    previousSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;
        
        this.goToSlide(this.currentSlide - 1);
    }
    
    goToSlide(slideNumber) {
        if (this.isAnimating || slideNumber === this.currentSlide || slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        this.isAnimating = true;
        
        // Remover clase activa de la diapositiva actual
        const currentSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        
        // Actualizar número de diapositiva
        this.currentSlide = slideNumber;
        
        // Agregar clase activa a la nueva diapositiva
        const newSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (newSlideElement) {
            setTimeout(() => {
                newSlideElement.classList.add('active');
                this.isAnimating = false;
            }, 50);
        }
        
        // Actualizar UI
        this.updateProgress();
        this.updateSlideCounter();
        this.updateNavigation();
        this.updateActiveNavLink();
        
        // Efectos de sonido simulados (opcional)
        this.playTransitionEffect();
    }
    
    toggleSidebar() {
        if (this.sidebar.classList.contains('active')) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        this.sidebar.classList.add('active');
        this.mainContent.classList.add('sidebar-open');
        
        // Animar entrada de elementos del sidebar
        this.animateSidebarItems();
    }
    
    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.mainContent.classList.remove('sidebar-open');
    }
    
    animateSidebarItems() {
        const items = this.sidebar.querySelectorAll('.nav-list li');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }
    
    updateProgress() {
        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
    
    updateSlideCounter() {
        this.currentSlideSpan.textContent = this.currentSlide;
        this.totalSlidesSpan.textContent = this.totalSlides;
    }
    
    updateNavigation() {
        // Actualizar estado de los botones
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Efectos visuales adicionales
        if (this.currentSlide === 1) {
            this.prevBtn.style.opacity = '0.3';
        } else {
            this.prevBtn.style.opacity = '1';
        }
        
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.style.opacity = '0.3';
        } else {
            this.nextBtn.style.opacity = '1';
        }
    }
    
    updateActiveNavLink() {
        // Remover clase activa de todos los enlaces
        this.navLinks.forEach(link => link.classList.remove('active'));
        
        // Agregar clase activa al enlace actual
        const activeLink = document.querySelector(`.nav-list a[data-slide="${this.currentSlide}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    playTransitionEffect() {
        // Simular efecto de transición con una pequeña vibración visual
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Efecto visual sutil
        document.body.style.transform = 'scale(0.999)';
        setTimeout(() => {
            document.body.style.transform = 'scale(1)';
        }, 100);
    }
    
    handleResize() {
        // Ajustar layout en redimensionamiento
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile && this.sidebar.classList.contains('active')) {
            this.closeSidebar();
        }
        
        // Recalcular dimensiones si es necesario
        this.adjustLayoutForDevice();
    }
    
    adjustLayoutForDevice() {
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        if (isMobile) {
            // Ajustes para móvil
            document.body.classList.add('mobile-view');
            document.body.classList.remove('tablet-view', 'desktop-view');
        } else if (isTablet) {
            // Ajustes para tablet
            document.body.classList.add('tablet-view');
            document.body.classList.remove('mobile-view', 'desktop-view');
        } else {
            // Ajustes para desktop
            document.body.classList.add('desktop-view');
            document.body.classList.remove('mobile-view', 'tablet-view');
        }
    }
    
    // Métodos para animaciones especiales
    animateCurrentSlide() {
        const currentSlideElement = document.querySelector(`.slide[data-slide="${this.currentSlide}"]`);
        if (!currentSlideElement) return;
        
        const animatableElements = currentSlideElement.querySelectorAll(
            '.point-item, .objective-item, .system-item, .limitation-item, .tool-item, .agent, .algorithm-item, .metric-item, .scenario-item, .step, .metric-result, .insight-item, .achievement-item, .future-item'
        );
        
        animatableElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Método para presentación automática (opcional)
    startAutoPresentation(intervalMs = 1000000) {
        this.autoInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoPresentation();
            }
        }, intervalMs);
    }
    
    stopAutoPresentation() {
        if (this.autoInterval) {
            clearInterval(this.autoInterval);
            this.autoInterval = null;
        }
    }
    
    // Método para modo presentación (pantalla completa)
    enterFullscreen() {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    // Método para exportar notas de presentación
    exportNotes() {
        const notes = {
            title: "Sistema de Debate Multi-Agente - Notas de Presentación",
            totalSlides: this.totalSlides,
            currentSlide: this.currentSlide,
            slides: []
        };
        
        this.slides.forEach((slide, index) => {
            const slideData = {
                number: index + 1,
                title: slide.querySelector('h1, h2')?.textContent || `Slide ${index + 1}`,
                content: slide.textContent.trim()
            };
            notes.slides.push(slideData);
        });
        
        // Crear y descargar archivo JSON
        const dataStr = JSON.stringify(notes, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'presentacion-notas.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    // Método para reiniciar presentación
    resetPresentation() {
        this.goToSlide(1);
        this.closeSidebar();
        this.stopAutoPresentation();
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new PresentationApp();
    
    // Exponer métodos globales para uso externo
    window.presentationApp = app;
    
    // Atajos de teclado adicionales para funciones avanzadas
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + combinaciones
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'f':
                case 'F':
                    e.preventDefault();
                    app.enterFullscreen();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    app.resetPresentation();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    app.exportNotes();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    if (app.autoInterval) {
                        app.stopAutoPresentation();
                    } else {
                        app.startAutoPresentation();
                    }
                    break;
            }
        }
    });
    
    // Detectar cambios de orientación en móvil
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            app.handleResize();
        }, 100);
    });
    
    // Prevenir zoom con pellizco en móvil
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', (e) => {
        e.preventDefault();
    });
    
    // Configurar visibilidad de página para pausar animaciones
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            app.stopAutoPresentation();
        }
    });
    
    // Mensaje de bienvenida en consola
    console.log(`
    🎯 Presentación TFM - Sistema de Debate Multi-Agente
    
    Atajos de teclado:
    ← → ↑ ↓ : Navegar entre diapositivas
    Espacio   : Siguiente diapositiva
    Home/End  : Primera/Última diapositiva
    1-9       : Ir directamente a diapositiva
    M         : Abrir/cerrar menú
    Escape    : Cerrar menú
    
    Combinaciones con Ctrl/Cmd:
    F : Pantalla completa
    R : Reiniciar presentación
    S : Exportar notas
    P : Iniciar/parar presentación automática
    
    Gestos táctiles:
    Deslizar izquierda/derecha para navegar
    `);
});

// Utilidades adicionales
const PresentationUtils = {
    // Formatear tiempo de presentación
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    // Calcular tiempo estimado de presentación
    estimatePresentation(slidesPerMinute = 1) {
        const totalMinutes = 12 / slidesPerMinute;
        return this.formatTime(totalMinutes * 60);
    },
    
    // Generar QR code para compartir (simulado)
    generateShareLink() {
        const url = window.location.href;
        console.log('Enlace para compartir:', url);
        return url;
    },
    
    // Detectar capacidades del dispositivo
    getDeviceCapabilities() {
        return {
            touchSupport: 'ontouchstart' in window,
            fullscreenSupport: !!(document.documentElement.requestFullscreen || 
                                 document.documentElement.webkitRequestFullscreen || 
                                 document.documentElement.msRequestFullscreen),
            vibrationSupport: 'vibrate' in navigator,
            orientationSupport: 'orientation' in window,
            keyboardSupport: true
        };
    }
};

// Exponer utilidades globalmente
window.PresentationUtils = PresentationUtils;
