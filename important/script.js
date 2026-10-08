const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));const menu=document.querySelector('.menu');const nav=document.querySelector('.nav nav');menu.addEventListener('click',()=>{nav.style.display=nav.style.display==='flex'?'none':'flex';nav.style.position='absolute';nav.style.top='76px';nav.style.left='0';nav.style.right='0';nav.style.padding='25px';nav.style.background='#0b0e19';nav.style.flexDirection='column'});
const voiceStatus=document.getElementById('voiceStatus');
const speakBtn=document.getElementById('speakBtn');
const stopBtn=document.getElementById('stopBtn');
const closeBtn=document.getElementById('voiceClose');

const answers={
  "Tell me about Gargi's projects":"Gargi has built projects in cybersecurity, natural language processing, and computer vision. Her highlighted projects include CyberShield AI, Fake News Detection, and Plant Disease Detection.",
  "What are Gargi's skills?":"Gargi works with Python, C++, SQL, machine learning, NLP, computer vision, TensorFlow, PyTorch, Scikit-learn, Flask, Streamlit, Docker, REST APIs, Git, Pandas and NumPy.",
  "What is Gargi's experience?":"Gargi has worked as a Machine Learning Developer at Tradeking, where she worked on data pipelines, predictive models, validation workflows, REST APIs and Docker-based deployment."
};

function speak(text){
  if(!('speechSynthesis' in window)){voiceStatus.textContent="Your browser does not support speech synthesis.";return;}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);
  u.rate=.96; u.pitch=1.08; u.volume=1;
  const voices=speechSynthesis.getVoices();
  const female=voices.find(v=>/female|zira|samantha|aria|google us english/i.test(v.name));
  if(female) u.voice=female;
  u.onstart=()=>voiceStatus.textContent="🔊 Speaking...";
  u.onend=()=>voiceStatus.textContent="Ready — ask me another question.";
  speechSynthesis.speak(u);
}
speakBtn.onclick=()=>speak("Hi! I'm Gargi's portfolio assistant. You can use the buttons below to learn about her projects, skills, or experience.");
stopBtn.onclick=()=>{speechSynthesis.cancel();voiceStatus.textContent="Voice stopped.";};
closeBtn.onclick=()=>document.getElementById('voiceAssistant').style.display='none';
document.querySelectorAll('.voice-prompts button').forEach(btn=>{
  btn.onclick=()=>{const q=btn.dataset.q;voiceStatus.textContent=q;speak(answers[q]||"I can tell you about Gargi's portfolio.");};
});

// Optional microphone input: supported in Chrome/Edge. The assistant listens, then answers.
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){
  const recognition=new SpeechRecognition();
  recognition.lang='en-IN'; recognition.interimResults=false; recognition.maxAlternatives=1;
  speakBtn.addEventListener('dblclick',()=>{
    voiceStatus.textContent="🎧 Listening... ask your question.";
    recognition.start();
  });
  recognition.onresult=e=>{
    const q=e.results[0][0].transcript.toLowerCase();
    let a="I can help with Gargi's projects, skills, experience, achievements, and contact information.";
    if(q.includes('project')) a=answers["Tell me about Gargi's projects"];
    else if(q.includes('skill')) a=answers["What are Gargi's skills?"];
    else if(q.includes('experience')||q.includes('work')) a=answers["What is Gargi's experience?"];
    voiceStatus.textContent="You asked: "+e.results[0][0].transcript;
    speak(a);
  };
  recognition.onerror=()=>voiceStatus.textContent="Microphone access was unavailable. You can use the buttons instead.";
}
