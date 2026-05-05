document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('collections-container');

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

        container.innerHTML = '';

        buildPresentation(data.dokumen);

    } catch (error) {
        console.error("Error loading presentation data:", error);
        container.innerHTML = `
            <div style="padding: 5rem 4rem; text-align: center; font-family: 'Inter', sans-serif;">
                <h2 style="color: var(--accent-secondary); margin-bottom: 1rem;">DATA RETRIEVAL FAILED</h2>
                <p style="color: var(--text-muted);">${error.message}</p>
                <p style="color: var(--text-muted); margin-top: 1rem;">Please ensure you are viewing this via a local server.</p>
            </div>
        `;
    }

    function cleanText(text) {
        if (!text) return '';
        let cleaned = text.replace(/\[source:\s*\d+\]/g, '');
        // Remove superscripts
        cleaned = cleaned.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, '');
        return cleaned;
    }

    function highlightText(text) {
        if (!text) return '';
        
        let highlighted = text;

        // 1. Structural labels (e.g., "1. Product:" or "• Bukti:")
        // We capture any leading bullets/numbers as a prefix so they don't get highlighted
        highlighted = highlighted.replace(/^([•\d\.\s]*)([^:.]{1,45}:)/gm, (match, prefix, label) => `${prefix}<span class="highlight-label">${label}</span>`);

        // 2. Content in parentheses (...) -> Yellow Tone (Delimiters stay white)
        highlighted = highlighted.replace(/\(([^)]+)\)/g, (match, content) => `(<span class="highlight-keyword">${content}</span>)`);

        // 3. Content in brackets [...] -> Red Tone (Delimiters stay white)
        highlighted = highlighted.replace(/\[([^\]]+)\]/g, (match, content) => `[<span class="highlight-strategy">${content}</span>]`);

        // 4. Strategy & Marketing terms (Highest Priority)
        const strategyTerms = /\b(Fase \d|Segmentasi|Targeting|Positioning|Unique Selling Point|USP|7P|Marketing Mix|Marketing \d\.\d)\b/gi;
        const keyTerms = /\b(TAM|SAM|SOM|O2O|Cheerleaders Effect|Blocking Content|Built-in Content|Product Placement|Product Usage|Product Knowledge)\b/gi;

        highlighted = highlighted.replace(strategyTerms, match => `<span class="highlight-strategy">${match}</span>`);
        highlighted = highlighted.replace(keyTerms, match => `<span class="highlight-keyword">${match}</span>`);

        // 5. English Vocabulary (Fashion & Tech - Cyan Tone)
        const englishVocab = /\b(techwear|cyberpunk|niche market|e-commerce|worldwide shipping|gender-neutral|uniseks|waterproof|windproof|water-resistant|premium|benefit sought|peer review|OOTD|athleisure|activewear|fast fashion|brand clothing|urban-dystopian|sci-fi|gaming|messenger carrier|Upper Armor|Lower Armor|manual screen printing|Direct Transfer Film|DTF|windbreaker|water-repellent|webbing|hero product|removable hoodie|swift mode system|swift mode|cast off belt|brick-and-mortar|glitch-art|Native|Earned Media|hype|Urban Ninja|Product Drop|Software|Hardware|System Update|NIGHTSHADE)\b/gi;
        
        highlighted = highlighted.replace(englishVocab, match => `<span class="highlight-en">${match}</span>`);
        
        return highlighted;
    }

    function formatParagraphs(paragraphs) {
        if (Array.isArray(paragraphs)) {
            return paragraphs.map(p => `<div class="content-item"><p>${highlightText(cleanText(p))}</p></div>`).join('');
        } else if (typeof paragraphs === 'string') {
            return `<div class="content-item"><p>${highlightText(cleanText(paragraphs))}</p></div>`;
        }
        return '';
    }

    function createPhaseHeader(title, index) {
        const phaseHeader = document.createElement('div');
        phaseHeader.id = `phase-${index}`;
        phaseHeader.style.padding = '8rem 4rem 4rem 4rem';
        phaseHeader.style.borderBottom = '1px solid var(--neutral-gunmetal)';
        phaseHeader.innerHTML = `
            <div class="fase-tag data-mono" style="margin-bottom: 1rem;">ARCHIVE // 0${index}</div>
            <h2 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: var(--text-primary); text-transform: uppercase;">${cleanText(title)}</h2>
        `;
        container.appendChild(phaseHeader);
    }

    function createSpread(faseName, title, contentHtml, visualHtml, extraClass = '') {
        const spread = document.createElement('div');
        spread.className = `spread ${extraClass}`;
        spread.innerHTML = `
            <div class="spread-visual glass-panel">
                <div style="z-index: 5; position: relative;">
                    <div class="fase-tag data-mono">${faseName}</div>
                </div>
                ${visualHtml}
                <h2 class="spread-title" style="z-index: 5; position: relative;">${cleanText(title)}</h2>
            </div>
            <div class="spread-content glass-panel">
                ${contentHtml}
            </div>
        `;
        container.appendChild(spread);
        observer.observe(spread);
    }

    function getVisualHtml(phaseNum, index) {
        if (phaseNum === 0) {
            const images = ['group-techwear-1.png', 'group-techwear-2.jpg', 'group-techwear-3.png'];
            return `
                <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: transparent;">
                    <div class="slideshow-container">
                        ${images.map((img, i) => `
                            <img src="images/Techwear/${img}" class="slide-img ${i === 0 ? 'active' : ''}">
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // FASE 3 IMAGE SUPPORT
        if (phaseNum === 3) {
            if (index === 1) {
                return `
                    <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: #000;">
                        <video autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover; opacity: 0.8;">
                            <source src="images/ThirdPhase/FASE 3  PROMOSI UNIK.mp4" type="video/mp4">
                        </video>
                    </div>
                `;
            } else if (index === 0) {
                return `
                    <div class="visual-placeholder data-mono" style="padding:2rem; border: 1px solid var(--neutral-gunmetal); background: #050505;">
                        <img src="images/ThirdPhase/Hashtag_techracer.png" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 10px var(--accent-primary));">
                    </div>
                `;
            } else if (index === 2) {
                return `
                    <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: #000;">
                        <video autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover; opacity: 0.9;">
                            <source src="images/ThirdPhase/Techracer_instagram.mp4" type="video/mp4">
                        </video>
                    </div>
                `;
            }
        }
        
        // FASE 4 VIDEO/IMAGE SUPPORT
        if (phaseNum === 4) {
            if (index === 1) {
                return `
                    <div class="visual-placeholder data-mono" style="padding:1rem; border: 1px solid var(--neutral-gunmetal); background: #080808;">
                        <img src="images/FourthPhase/product knowledge review.png" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 15px rgba(255,255,255,0.1));">
                    </div>
                `;
            } else if (index === 2) {
                return `
                    <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: #000;">
                        <div class="mixed-media-container">
                            <video class="mixed-video" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: contain;">
                                <source src="images/FourthPhase/UGC.mp4" type="video/mp4">
                            </video>
                            <div class="mixed-slider" style="display:none; width: 100%; height: 100%; position: relative;">
                                <img src="images/FourthPhase/UGC2.png" class="mixed-slide active" style="width: 100%; height: 100%; object-fit: contain; position: absolute; top:0; left:0;">
                                <img src="images/FourthPhase/UGC3.png" class="mixed-slide" style="width: 100%; height: 100%; object-fit: contain; position: absolute; top:0; left:0; opacity:0;">
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        let imgName = null;
        if (phaseNum === 1) {
            const fase1Images = ['techracer_web_6.jpg', 'techracer_web_7.jpg', 'techracer_web_8.jpg'];
            imgName = fase1Images[index % fase1Images.length];
        } else if (phaseNum === 2) {
            const fase2Images = ['techracer_web_9.jpg', 'techracer_web_10.jpg', 'techracer_web_11.jpg'];
            imgName = fase2Images[index % fase2Images.length];
        }

        if (imgName) {
            return `
                <div class="visual-placeholder data-mono" style="padding:0; border: 1px solid var(--neutral-gunmetal); background: transparent;">
                    <img src="images/${imgName}" style="width: 100%; height: 100%; object-fit: cover; filter: grayscale(10%) contrast(1.1);">
                </div>
            `;
        }

        return `<div class="visual-placeholder data-mono">[ VISUAL ASSET PLACEHOLDER ]</div>`;
    }

    function buildPresentation(dokumen) {
        // OVERVIEW
        let overviewHtml = formatParagraphs(dokumen.pengantar.paragraf);
        createSpread('OVERVIEW // PENGANTAR', dokumen.pengantar.sub_judul, overviewHtml, getVisualHtml(0, 0));

        // FASE 1 (3 Spreads)
        createPhaseHeader(dokumen.fase_1.sub_judul, 1);
        
        let f1_seg_tabel = dokumen.fase_1.analisis_segmentasi_pasar.tabel_1.data.map(d => `
            <div class="content-item">
                <h4>${cleanText(d.dimensi_segmentasi)}</h4>
                <p>${highlightText(cleanText(d.deskripsi_dan_analisis))}</p>
            </div>
        `).join('');
        createSpread('FASE 1 // SEGMENTASI', dokumen.fase_1.analisis_segmentasi_pasar.sub_judul, f1_seg_tabel, getVisualHtml(1, 0));

        let f1_targeting = formatParagraphs(dokumen.fase_1.penargetan_pasar.paragraf);
        createSpread('FASE 1 // TARGETING', dokumen.fase_1.penargetan_pasar.sub_judul, f1_targeting, getVisualHtml(1, 1));

        let f1_positioning = formatParagraphs(dokumen.fase_1.pemosisian_merek.paragraf);
        createSpread('FASE 1 // POSITIONING', dokumen.fase_1.pemosisian_merek.sub_judul, f1_positioning, getVisualHtml(1, 2));

        // FASE 2 (2 Spreads)
        createPhaseHeader(dokumen.fase_2.sub_judul, 2);
        
        let f2_usp_tabel = dokumen.fase_2.analisis_proposisi_penjualan_unik.tabel_2.data.map(d => `
            <div class="content-item">
                <h4>${cleanText(d.dimensi_usp)}</h4>
                <p>${highlightText(cleanText(d.temuan_riset))}</p>
            </div>
        `).join('');
        createSpread('FASE 2 // USP', dokumen.fase_2.analisis_proposisi_penjualan_unik.sub_judul, f2_usp_tabel, getVisualHtml(2, 0));

        let f2_7p_poin = dokumen.fase_2.analisis_bauran_pemasaran.poin_7p.map(p => `
            <div class="content-item">
                <p>${highlightText(cleanText(p))}</p>
            </div>
        `).join('');
        createSpread('FASE 2 // 7P MIX', dokumen.fase_2.analisis_bauran_pemasaran.sub_judul, f2_7p_poin, getVisualHtml(2, 2));

        // FASE 3 (3 Spreads)
        createPhaseHeader(dokumen.fase_3.sub_judul, 3);
        createSpread('FASE 3 // PROMOSI UNIK', dokumen.fase_3.promosi_unik.sub_judul, formatParagraphs(dokumen.fase_3.promosi_unik.poin), getVisualHtml(3, 1), 'full-video-layout');
        createSpread('FASE 3 // JENIS MIX', dokumen.fase_3.jenis_mix.sub_judul, formatParagraphs(dokumen.fase_3.jenis_mix.poin), getVisualHtml(3, 2), 'full-video-layout');
        createSpread('FASE 3 // ALASAN MENARIK', dokumen.fase_3.alasan_menarik.sub_judul, formatParagraphs(dokumen.fase_3.alasan_menarik.poin), getVisualHtml(3, 0));

        // FASE 4 (3 Spreads)
        createPhaseHeader(dokumen.fase_4.sub_judul, 4);
        dokumen.fase_4.taktik.forEach((taktik, idx) => {
            let inner_html = formatParagraphs(taktik.teks);
            let extraClass = (idx === 2) ? 'full-video-layout' : '';
            createSpread(`FASE 4 // KOLABORASI 0${idx + 1}`, taktik.judul, inner_html, getVisualHtml(4, idx), extraClass);
        });



        // WORKS CITED - Dropdown
        let worksCited = dokumen.works_cited;
        let dropdownHtml = `
            <div class="dropdown" style="margin-top: 4rem; width: 100%;">
                <div class="dropdown-header glass-panel" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>> VIEW ${cleanText(worksCited.sub_judul).toUpperCase()}</span>
                    <span>▼</span>
                </div>
                <div class="dropdown-content glass-panel">
                    <ul>
                        ${worksCited.daftar.map(item => `<li>${cleanText(item)}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        const finalDiv = document.createElement('div');
        finalDiv.style.padding = '0 0 4rem 0';
        finalDiv.style.gridColumn = '1 / -1';
        finalDiv.innerHTML = dropdownHtml;
        container.appendChild(finalDiv);

        startSlideshows();
        initMixedMedia();
    }

    function initMixedMedia() {
        const containers = document.querySelectorAll('.mixed-media-container');
        containers.forEach(container => {
            const video = container.querySelector('.mixed-video');
            const slider = container.querySelector('.mixed-slider');
            const slides = container.querySelectorAll('.mixed-slide');
            
            video.onended = () => {
                video.style.display = 'none';
                slider.style.display = 'block';
                
                let currentSlide = 0;
                const totalSlides = slides.length;
                
                const runSlider = () => {
                    setTimeout(() => {
                        slides[currentSlide].style.opacity = '0';
                        currentSlide++;
                        
                        if (currentSlide < totalSlides) {
                            slides[currentSlide].style.opacity = '1';
                            runSlider();
                        } else {
                            // End of slider, back to video
                            slider.style.display = 'none';
                            // Reset slides for next loop
                            slides.forEach((s, i) => s.style.opacity = i === 0 ? '1' : '0');
                            video.style.display = 'block';
                            video.play();
                        }
                    }, 3000); // 3 seconds per image
                };
                
                runSlider();
            };
        });
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
            }, 3000);
        });
    }
});
