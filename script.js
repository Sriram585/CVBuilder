const app = {
    state: {
        step: 1,
        method: null,
        data: { name: '', title: '', email: '', phone: '', experience: '', skills: '', education: '', certifications: '' },
        currentConfig: null,
        category: 'all'
    },

    init: () => {
        if (window.lucide) lucide.createIcons();
        generator.generateBatch(); // Generate initial batch
    },

    setCategory: (cat, btn) => {
        app.state.category = cat;
        // Update Buttons
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active');
            b.style.background = 'var(--c-white)';
            b.style.color = 'var(--text-main)';
            b.style.borderColor = 'var(--border-color)';
        });
        btn.classList.add('active');
        btn.style.background = 'var(--c-dark-green)';
        btn.style.color = 'white';
        btn.style.borderColor = 'var(--c-dark-green)';

        generator.generateBatch(false, cat);
    },

    setMethod: (method) => {
        app.state.method = method;
        if (method === 'upload') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.pdf,.doc,.docx,.txt';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Mock Parse
                    app.state.data = {
                        name: "Alex Morgan",
                        title: "Senior Product Manager",
                        email: "alex.morgan@example.com",
                        phone: "(555) 012-3456",
                        experience: "• Led cross-functional team of 15 designers and developers.\n• Increased user retention by 25% through UI overhaul.\n• Managed product roadmap for Q3 and Q4.",
                        skills: "Product Strategy, Agile, UX Design, Data Analysis",
                        education: "MBA, Harvard Business School (2018)",
                        certifications: "Certified Scrum Master (CSM)\nGoogle Analytics Certified"
                    };
                    app.populateForm();
                    app.nextStep();
                }
            };
            input.click();
        } else {
            app.state.data = { name: '', title: '', email: '', phone: '', experience: '', skills: '', education: '', certifications: '' };
            app.populateForm();
            app.nextStep();
        }
    },

    nextStep: () => {
        if (app.state.step === 2) app.scrapeFormData();
        app.state.step++;
        app.updateUI();
    },

    prevStep: () => {
        app.state.step--;
        app.updateUI();
    },

    selectTemplate: (config) => {
        app.state.currentConfig = config; // Store the unique gene set
        app.renderResume();
        // Highlight selection
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        // Find the card that was clicked (handled by onclick wrapper) via ID in real app, but here just re-render is fine for flow
        app.nextStep();
    },

    updateUI: () => {
        document.querySelectorAll('.wizard-step').forEach(el => el.classList.add('hidden'));
        document.getElementById(`step-${app.state.step}`).classList.remove('hidden');

        document.querySelectorAll('.step').forEach(el => {
            const s = parseInt(el.dataset.step);
            el.classList.remove('active');
            if (s === app.state.step) el.classList.add('active');
        });

        if (app.state.step === 4) app.renderResume();
    },

    scrapeFormData: () => {
        app.state.data.name = document.getElementById('inp-name').value;
        app.state.data.title = document.getElementById('inp-title').value;
        app.state.data.email = document.getElementById('inp-email').value;
        app.state.data.phone = document.getElementById('inp-phone').value;
        app.state.data.experience = document.getElementById('inp-experience').value;
        app.state.data.skills = document.getElementById('inp-skills').value;
        app.state.data.education = document.getElementById('inp-education').value;
        app.state.data.certifications = document.getElementById('inp-certifications').value;
    },

    populateForm: () => {
        document.getElementById('inp-name').value = app.state.data.name;
        document.getElementById('inp-title').value = app.state.data.title;
        document.getElementById('inp-email').value = app.state.data.email;
        document.getElementById('inp-phone').value = app.state.data.phone;
        document.getElementById('inp-experience').value = app.state.data.experience;
        document.getElementById('inp-skills').value = app.state.data.skills;
        document.getElementById('inp-education').value = app.state.data.education;
        document.getElementById('inp-certifications').value = app.state.data.certifications || '';
    },

    renderResume: () => {
        const config = app.state.currentConfig || generator.generateRandomConfig(); // Fallback
        const data = app.state.data;
        const container = document.getElementById('final-preview');

        // Mock data fallback
        const d = {
            name: data.name || "Your Name",
            title: data.title || "Job Title",
            email: data.email || "email@example.com",
            phone: data.phone || "(123) 456-7890",
            experience: (data.experience || "• Your work experience will appear here.").split('\n').map(l => `<li>${l}</li>`).join(''),
            skills: data.skills || "Skill 1, Skill 2, Skill 3",
            education: data.education || "Degree, University",
            certifications: (data.certifications || "").split('\n').join('<br>')
        };

        // RENDER LOGIC BASED ON GENES
        const primaryColor = config.colors.primary;
        const fontHeading = config.fonts.heading;
        const fontBody = config.fonts.body;

        // Styles
        const headerStyle = `background: ${config.headerType === 'solid' ? primaryColor : 'transparent'}; color: ${config.headerType === 'solid' ? 'white' : primaryColor};`;
        const sectionHeaderStyle = `border-bottom: 2px solid ${primaryColor}; color: ${primaryColor}; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; margin-bottom: 1rem; padding-bottom: 0.5rem;`;

        // Blocks
        const headerBlock = `
            <header class="header-${config.headerAlign}" style="padding: 2rem; ${headerStyle}">
                <h1 style="font-family: ${fontHeading}; font-size: 2.5em; line-height: 1.1; margin-bottom: 0.2em;">${d.name}</h1>
                <div style="font-family: ${fontBody}; font-size: 1.1em; opacity: 0.9; margin-bottom: 0.5em;">${d.title}</div>
                <div style="font-family: ${fontBody}; font-size: 0.9em; opacity: 0.8;">${d.email} • ${d.phone}</div>
            </header>
        `;

        const expBlock = `
            <section style="margin-bottom: 2rem;">
                <h3 style="font-family: ${fontHeading}; ${sectionHeaderStyle}">Experience</h3>
                <ul style="font-family: ${fontBody}; padding-left: 1.2em; line-height: 1.5; font-size: 0.95em;">${d.experience}</ul>
            </section>
        `;

        const eduBlock = `
            <section style="margin-bottom: 2rem;">
                <h3 style="font-family: ${fontHeading}; ${sectionHeaderStyle}">Education</h3>
                <div style="font-family: ${fontBody};">${d.education}</div>
            </section>
        `;

        const skillBlock = `
             <section style="margin-bottom: 2rem;">
                <h3 style="font-family: ${fontHeading}; ${sectionHeaderStyle}">Skills</h3>
                <div style="font-family: ${fontBody}; line-height: 1.6;">${d.skills}</div>
            </section>
        `;

        const certsBlock = d.certifications ? `
            <section style="margin-bottom: 2rem;">
               <h3 style="font-family: ${fontHeading}; ${sectionHeaderStyle}">Certifications</h3>
               <div style="font-family: ${fontBody}; line-height: 1.4;">${d.certifications}</div>
           </section>
       ` : '';

        // Layout Assembly
        let layoutHtml = '';
        if (config.layout === 'sidebar-left') {
            layoutHtml = `
                <div class="layout-sidebar-left" style="display: flex; height: 100%;">
                    <aside style="width: 32%; background: #f4f4f5; padding: 2rem; border-right: 1px solid #e5e7eb;">
                        ${skillBlock}
                        ${eduBlock}
                        ${certsBlock}
                    </aside>
                    <main style="width: 68%; padding: 2rem;">
                        ${expBlock}
                    </main>
                </div>
            `;
        } else if (config.layout === 'sidebar-right') {
            layoutHtml = `
                 <div class="layout-sidebar-right" style="display: flex; flex-direction: row-reverse; height: 100%;">
                    <aside style="width: 32%; background: #f4f4f5; padding: 2rem; border-left: 1px solid #e5e7eb;">
                        ${skillBlock}
                         ${eduBlock}
                         ${certsBlock}
                    </aside>
                    <main style="width: 68%; padding: 2rem;">
                        ${expBlock}
                    </main>
                </div>
            `;
        } else {
            layoutHtml = `
                <div class="layout-full-width" style="padding: 2rem;">
                    ${expBlock}
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                        <div>
                            ${eduBlock}
                            ${certsBlock}
                        </div>
                        <div>${skillBlock}</div>
                    </div>
                </div>
            `;
        }

        // Full Render
        // If header is 'solid', it wraps everything or sits top? Atomic headers usually sit top.
        // For sidebar layouts, we need to decide if header spans full width or sits in main.
        // Simplified: Header is always top, then content split.

        container.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                ${headerBlock}
                <div style="flex: 1; border-top: 1px solid #eee;">
                    ${layoutHtml}
                </div>
            </div>
        `;
    }
};

/**
 * Procedural Generator Engine
 * Generates infinite combinations of design "Genes".
 */
const generator = {
    // Genes: Expanded to ~50 Palettes and ~20 Fonts
    palettes: [
        { name: "Slate", primary: "#1e293b" },
        { name: "Indigo", primary: "#4f46e5" },
        { name: "Emerald", primary: "#059669" },
        { name: "Rose", primary: "#e11d48" },
        { name: "Blue", primary: "#2563eb" },
        { name: "Violet", primary: "#7c3aed" },
        { name: "Teal", primary: "#0d9488" },
        { name: "Amber", primary: "#d97706" },
        { name: "Cyan", primary: "#0891b2" },
        { name: "Fuchsia", primary: "#c026d3" },
        { name: "Lime", primary: "#65a30d" },
        { name: "Orange", primary: "#ea580c" },
        { name: "Sky", primary: "#0284c7" },
        { name: "Pink", primary: "#db2777" },
        { name: "Red", primary: "#dc2626" },
        { name: "Yellow", primary: "#ca8a04" },
        { name: "Green", primary: "#16a34a" },
        { name: "Purple", primary: "#9333ea" },
        { name: "Zinc", primary: "#52525b" },
        { name: "Neutral", primary: "#525252" },
        { name: "Stone", primary: "#57534e" },
        { name: "Midnight", primary: "#0f172a" },
        { name: "Forest", primary: "#064e3b" },
        { name: "Burgundy", primary: "#7f1d1d" },
        { name: "Navy", primary: "#1e3a8a" },
        { name: "Crimson", primary: "#9f1239" },
        { name: "Chocolate", primary: "#451a03" },
        { name: "Gold", primary: "#b45309" },
        { name: "Olive", primary: "#3f6212" },
        { name: "Ocean", primary: "#155e75" },
        { name: "Royal", primary: "#4338ca" },
        { name: "Coral", primary: "#be123c" },
        { name: "Berry", primary: "#831843" },
        { name: "Eggplant", primary: "#581c87" },
        { name: "Charcoal", primary: "#334155" },
        { name: "Steel", primary: "#374151" },
        { name: "Bronze", primary: "#78350f" },
        { name: "Copper", primary: "#9a3412" },
        { name: "Plum", primary: "#701a75" },
        { name: "Mauve", primary: "#86198f" },
        { name: "Seafoam", primary: "#115e59" },
        { name: "Mint", primary: "#047857" },
        { name: "Leaf", primary: "#14532d" },
        { name: "Sunset", primary: "#c2410c" },
        { name: "Dusk", primary: "#4c1d95" },
        { name: "Lavender", primary: "#7e22ce" },
        { name: "Sand", primary: "#78350f" },
        { name: "Earth", primary: "#431407" },
        { name: "Graphite", primary: "#18181b" },
        { name: "Ash", primary: "#27272a" }
    ],
    fonts: [
        { heading: "'Helvetica Neue', sans-serif", body: "'Helvetica Neue', sans-serif" },
        { heading: "'Georgia', serif", body: "'Georgia', serif" },
        { heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
        { heading: "'Oswald', sans-serif", body: "'Open Sans', sans-serif" },
        { heading: "'Montserrat', sans-serif", body: "'Merriweather', serif" },
        { heading: "'Roboto', sans-serif", body: "'Roboto', sans-serif" },
        { heading: "'Lato', sans-serif", body: "'Lato', sans-serif" },
        { heading: "'Open Sans', sans-serif", body: "'Open Sans', sans-serif" },
        { heading: "'Raleway', sans-serif", body: "'Open Sans', sans-serif" },
        { heading: "'Poppins', sans-serif", body: "'Lato', sans-serif" },
        { heading: "'Merriweather', serif", body: "'Merriweather', serif" },
        { heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif" },
        { heading: "'Ubuntu', sans-serif", body: "'Ubuntu', sans-serif" },
        { heading: "'Rubik', sans-serif", body: "'Rubik', sans-serif" },
        { heading: "'Lora', serif", body: "'Lora', serif" },
        { heading: "'Bitter', serif", body: "'Lato', sans-serif" },
        { heading: "'Arvo', serif", body: "'Open Sans', sans-serif" },
        { heading: "'Josefin Sans', sans-serif", body: "'Lato', sans-serif" },
        { heading: "'Fjalla One', sans-serif", body: "'Nunito', sans-serif" },
        { heading: "'Cabin', sans-serif", body: "'Cabin', sans-serif" },
        { heading: "'Quicksand', sans-serif", body: "'Quicksand', sans-serif" }
    ],
    layouts: ["sidebar-left", "sidebar-right", "full-width"],
    headers: ["centered", "left", "solid"],

    // Categories logic
    getCategorySubset: (category) => {
        if (category === 'professional') {
            return {
                palettes: generator.palettes.filter(p => ['Slate', 'Indigo', 'Navy', 'Midnight', 'Forest', 'Charcoal', 'Steel', 'Ash', 'Neutral', 'Zinc', 'Stone', 'Blue', 'Teal'].includes(p.name)),
                fonts: generator.fonts.filter(f => ['Helvetica Neue', 'Georgia', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Lora', 'Arvo'].some(n => f.heading.includes(n)))
            };
        } else if (category === 'creative') {
            return {
                palettes: generator.palettes.filter(p => !['Slate', 'Navy', 'Midnight', 'Charcoal', 'Ash', 'Neutral'].includes(p.name)), // Exclude strictly boring ones
                fonts: generator.fonts // All fonts are fair game, maybe bias towards display ones in future
            };
        }
        return { palettes: generator.palettes, fonts: generator.fonts }; // 'all'
    },

    // Methods
    generateRandomConfig: (category = 'all') => {
        const subset = generator.getCategorySubset(category);
        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
        return {
            id: Math.random().toString(36).substr(2, 9),
            colors: rand(subset.palettes),
            fonts: rand(subset.fonts),
            layout: rand(generator.layouts),
            headerType: rand(generator.headers),
            headerAlign: rand(['left', 'centered']) // Independent of type sometimes
        };
    },

    generateBatch: (append = false, category = app.state.category || 'all') => {
        const container = document.getElementById('template-grid');
        if (!append) container.innerHTML = '';

        for (let i = 0; i < 9; i++) { // Generate 9 at a time
            const config = generator.generateRandomConfig(category);

            const card = document.createElement('div');
            card.className = 'template-card';
            card.onclick = () => app.selectTemplate(config);

            // Generate visual thumbnail using pure CSS/HTML mocking
            // We use the same structure as the full resume but scaled down with CSS transform or specific styles
            const thumbBg = config.headerType === 'solid' ? config.colors.primary : '#fff';
            const thumbText = config.headerType === 'solid' ? '#fff' : config.colors.primary;
            const borderStyle = `border-top: 4px solid ${config.colors.primary}`;

            let miniLayout = '';
            if (config.layout === 'sidebar-left') {
                miniLayout = `<div style="display:flex; height:100%;"><div style="width:30%; background:#f3f3f3;"></div><div style="flex:1;"></div></div>`;
            } else if (config.layout === 'sidebar-right') {
                miniLayout = `<div style="display:flex; height:100%;"><div style="flex:1;"></div><div style="width:30%; background:#f3f3f3;"></div></div>`;
            } else {
                miniLayout = `<div style="padding: 10px;"></div>`;
            }

            const headerHTML = `<header style="height: 30px; background: ${thumbBg}; margin-bottom: 5px;"></header>`;

            card.innerHTML = `
                <div class="mini-cv">
                    ${headerHTML}
                    <div style="flex: 1; padding: 5px; position:relative;">
                        ${miniLayout}
                        <div style="position:absolute; top:10px; left:10px; width:40px; height:4px; background:#ddd;"></div>
                        <div style="position:absolute; top:20px; left:10px; width:80px; height:2px; background:#eee;"></div>
                        <div style="position:absolute; top:25px; left:10px; width:70px; height:2px; background:#eee;"></div>
                    </div>
                </div>
                <h3>${config.colors.name} ${config.layout.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}</h3>
                <p style="font-size:0.75rem; color:#888;">${config.fonts.heading.split(',')[0].replace(/'/g, '')}</p>
            `;

            container.appendChild(card);
        }
    }
};

document.addEventListener('DOMContentLoaded', app.init);
