document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('collections-container');

    // Smooth reveal animation on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    try {
        const response = await fetch('materi.JSON');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        container.innerHTML = ''; // Clear loading text
        
        // Build the Lookbook spreads
        buildLookbook(data.presentation_data);

    } catch (error) {
        console.error("Error loading presentation data:", error);
        container.innerHTML = `
            <div style="padding: 5rem 4rem; text-align: center; font-family: 'Syncopate', sans-serif;">
                <h2 style="color: #ff3366; margin-bottom: 1rem;">DATA RETRIEVAL FAILED</h2>
                <p style="font-family: 'Inter', sans-serif; color: var(--text-muted);">${error.message}</p>
                <p style="font-family: 'Inter', sans-serif; color: var(--text-muted); margin-top: 1rem;">Please ensure you are viewing this via a local server.</p>
            </div>
        `;
    }

    function buildLookbook(presentationData) {
        let slideCounter = 1;

        presentationData.forEach((faseData, faseIndex) => {
            
            // Optional: We can insert a large divider for the phase
            const phaseHeader = document.createElement('div');
            phaseHeader.id = `phase-${faseIndex + 1}`;
            phaseHeader.style.padding = '8rem 4rem 4rem 4rem';
            phaseHeader.style.borderBottom = '1px solid var(--border)';
            phaseHeader.innerHTML = `
                <div class="fase-tag" style="margin-bottom: 1rem;">COLLECTION 0${faseIndex + 1}</div>
                <h2 style="font-family: 'Syncopate', sans-serif; font-size: clamp(2rem, 4vw, 4rem);">${faseData.fase}</h2>
            `;
            container.appendChild(phaseHeader);

            // Iterate slides as spreads
            faseData.slides.forEach((slideData) => {
                const highlightText = (text) => {
                    // Highlight starting context (e.g. "Wilayah:", "Umur:")
                    const startingContextPattern = /^([^:]+):/;
                    let highlightedText = text.replace(startingContextPattern, (match, p1) => {
                        return `<span class="context-label">${p1}:</span>`;
                    });

                    const keywords = /(Techwear|Marketing \d\.\d|Segmentasi|Geografis|Demografis|Psikografis|Perilaku|Targeting|Gore-Tex|water-resistant|windproof|breathable|streetwear|cyberpunk|Unique Selling Point|USP|O2O|Omnichannel|Direct-to-Consumer|DTC|FOMO|Slow Fashion|premium pricing|investment piece|Guerilla Marketing|Sales Promotion|Cheerleaders Effect|Blocking Content|Built-in Content|Product Placement|Product Usage)/gi;
                    return highlightedText.replace(keywords, match => `<span style="color: var(--neon-cyan); font-weight: 600; text-shadow: 0 0 8px rgba(0, 243, 255, 0.4);">${match}</span>`);
                };

                const spread = document.createElement('div');
                spread.className = 'spread';

                let contentHtml = '';
                slideData.konten.forEach(item => {
                    // Check if item is a header/definition
                    let isHeader = item.match(/^[0-9]\./) || 
                                   item.includes("Definisi Konsep:") || 
                                   item.includes("Analisis Penerapan pada Techwear:") ||
                                   item.includes("Jenis Promotion Mix:") ||
                                   item.match(/^[A-Za-z]+\s*\([^)]+\):/);
                    
                    let isImagePlaceholder = item.startsWith("Bukti Visual:") || item.startsWith("(Masukkan") || item.startsWith("(Catatan");

                    if (isImagePlaceholder) {
                        contentHtml += `
                            <div class="content-item">
                                <div style="padding: 2rem; border: 1px dashed var(--border); color: var(--text-muted); font-size: 0.85rem; font-style: italic;">
                                    ${item}
                                </div>
                            </div>
                        `;
                    } else if (isHeader) {
                        let parts = item.split(':');
                        if(parts.length > 1 && !item.match(/^[0-9]\./)) {
                            contentHtml += `
                                <div class="content-item">
                                    <h4>${parts[0]}:</h4>
                                    <p>${highlightText(parts.slice(1).join(':'))}</p>
                                </div>
                            `;
                        } else {
                            contentHtml += `
                                <div class="content-item">
                                    <h4>${item}</h4>
                                </div>
                            `;
                        }
                    } else {
                        contentHtml += `
                            <div class="content-item">
                                <p>${highlightText(item)}</p>
                            </div>
                        `;
                    }
                });

                // Get abstract identifier for image side
                let identifier = slideData.judul_slide.split(':')[0] || `ITEM 0${slideCounter}`;
                let title = slideData.judul_slide.split(':').slice(1).join(':').trim() || slideData.judul_slide;

                let visualContent = `
                        <div class="visual-placeholder data-mono">
                            [ VISUAL ASSET PLACEHOLDER ]
                        </div>
                `;

                // Visual Asset Mapping Logic
                let currentFase = faseData.fase.toUpperCase();
                let slideTitle = slideData.judul_slide;

                if (currentFase.includes("PERTAMA")) {
                    let images = [];
                    if (slideTitle.includes('Slide 1')) {
                        images = ['nyxchange_model_1.jpg', 'nyxchange_model_2.jpg', 'androgynous-techwear-1.jpg'];
                    } else if (slideTitle.includes('Slide 2')) {
                        images = ['techwear-rain-jacket-2.jpg', 'techwear-rain-jacket-3.jpg', 'techweartstorm-techwear-jacket-1.jpeg'];
                    } else if (slideTitle.includes('Slide 3')) {
                        images = ['nyxchange_model_3.jpg', 'nyxchange_model_4.jpg', 'androgynous-techwear-2.jpg'];
                    }

                    if (images.length > 0) {
                        visualContent = `
                            <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: transparent;">
                                <div class="slideshow-container">
                                    ${images.map((img, i) => `<img src="images/Techwear/FirstPhase/${img}" class="slide-img ${i === 0 ? 'active' : ''}">`).join('')}
                                </div>
                            </div>
                        `;
                    }
                } else if (currentFase.includes("KEDUA")) {
                    let images = [];
                    if (slideTitle.includes('Slide 1')) {
                        images = ['black-workwear-jacket_2.jpg', 'black-workwear-jacket_3.jpg', 'black-workwear-jacket_4.jpg', 'black-workwear-jacket_5.jpg'];
                    } else if (slideTitle.includes('Slide 2')) {
                        images = ['Gemini_Generated_Image_8kuvmv8kuvmv8kuv.png', 'Gemini_Generated_Image_g0i4wlg0i4wlg0i4.png'];
                    } else if (slideTitle.includes('Slide 3')) {
                        // Special case: Single HD image for 7P Visualization
                        visualContent = `
                            <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: transparent;">
                                <img src="images/Techwear/SecondPhase/7P_Visualization.png" class="slide-img" style="opacity: 1; animation: none;">
                            </div>
                        `;
                    }

                    if (images.length > 0) {
                        visualContent = `
                            <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: transparent;">
                                <div class="slideshow-container">
                                    ${images.map((img, i) => `<img src="images/Techwear/SecondPhase/${img}" class="slide-img ${i === 0 ? 'active' : ''}">`).join('')}
                                </div>
                            </div>
                        `;
                    }
                } else if (currentFase.includes("KETIGA")) {
                    let images = [];
                    if (slideTitle.includes('Slide 1')) {
                        images = ['group-techwear-1.png', 'group-techwear-2.jpg', 'group-techwear-3.png'];
                    }

                    if (images.length > 0) {
                        visualContent = `
                            <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: transparent;">
                                <div class="slideshow-container">
                                    ${images.map((img, i) => `<img src="images/Techwear/ThirdPhase/${img}" class="slide-img ${i === 0 ? 'active' : ''}">`).join('')}
                                </div>
                            </div>
                        `;
                    }
                }

                spread.innerHTML = `
                    <div class="spread-visual glass-panel">
                        <div>
                            <div class="fase-tag data-mono">${faseData.fase} // ${identifier}</div>
                        </div>
                        ${visualContent}
                        <h2 class="spread-title">${title}</h2>
                    </div>
                    <div class="spread-content glass-panel">
                        ${contentHtml}
                    </div>
                `;

                container.appendChild(spread);
                observer.observe(spread);
                slideCounter++;
            });
        });
        
        // Initialize slideshows after content is added
        startSlideshows();
    }

    function startSlideshows() {
        const containers = document.querySelectorAll('.slideshow-container');
        containers.forEach(container => {
            const images = container.querySelectorAll('.slide-img');
            if (images.length <= 1) return;

            let currentIndex = 0;
            setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, 3000); // 3 seconds per image
        });
    }
});
