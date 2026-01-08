document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const jobDescriptionInput = document.getElementById('job-description');
    const currentResumeInput = document.getElementById('current-resume');
    const cvPreview = document.getElementById('cv-preview');

    generateBtn.addEventListener('click', async () => {
        const jobDescription = jobDescriptionInput.value.trim();
        const currentResume = currentResumeInput.value.trim();

        if (!jobDescription || !currentResume) {
            alert('Please provide both a job description and your current resume details.');
            return;
        }

        // UI Loading State
        setLoading(true);

        try {
            // TODO: Replace with actual API call to your backend
            // const response = await fetch('/api/generate-cv', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ jobDescription, currentResume })
            // });
            // const data = await response.json();

            // Mock simulation of API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock Result
            const mockCV = `
                <div style="max-width: 800px; margin: 0 auto; line-height: 1.5;">
                    <h1 style="border-bottom: 2px solid #333; padding-bottom: 10px;">John Doe</h1>
                    <p><strong>Email:</strong> john.doe@example.com | <strong>Phone:</strong> (555) 123-4567</p>
                    
                    <h3>Professional Summary</h3>
                    <p>Results-oriented professional with experience tailored to: <em>${jobDescription.substring(0, 50)}...</em></p>
                    
                    <h3>Experience</h3>
                    <ul>
                        <li>Implemented key features resulting in 20% efficiency gain.</li>
                        <li>Collaborated with cross-functional teams to deliver projects on time.</li>
                    </ul>

                     <h3>Skills</h3>
                    <p>Python, JavaScript, AI Integration, Project Management</p>
                </div>
            `;

            renderCV(mockCV);

        } catch (error) {
            console.error('Error:', error);
            cvPreview.innerHTML = '<p style="color: red;">An error occurred while generating the CV. Please try again.</p>';
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="spinner"></span> Generating...';
            cvPreview.classList.add('empty');
            cvPreview.innerHTML = `
                <div class="placeholder-content">
                    <p>Generating your tailored CV...</p>
                    <p style="font-size: 0.8rem; opacity: 0.7;">This may take a few seconds.</p>
                </div>
            `;
        } else {
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="btn-text">Generate CV</span><span class="btn-icon">→</span>';
        }
    }

    function renderCV(htmlContent) {
        cvPreview.classList.remove('empty');
        cvPreview.innerHTML = htmlContent;
    }
});
