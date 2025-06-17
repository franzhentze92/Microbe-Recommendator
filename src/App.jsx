import React, { useState } from 'react';
import { products } from './data/products';
import { benefits } from './data/benefits';
import { microbes } from './data/microbes';

const MAIN_GREEN = '#8cb43a';

function App() {
  // Step state
  const [step, setStep] = useState(1);
  // User selections
  const [selectedBenefits, setSelectedBenefits] = useState([]);
  const [applicationMethod, setApplicationMethod] = useState('');
  const [showPathogen, setShowPathogen] = useState(false);
  const [showInsect, setShowInsect] = useState(false);
  const [pathogenScope, setPathogenScope] = useState('');
  const [pathogenTypes, setPathogenTypes] = useState([]);
  const [insectTypes, setInsectTypes] = useState([]);

  // Debug: log current step and state
  console.log('Current step:', step, 'showPathogen:', showPathogen, 'showInsect:', showInsect, 'selectedBenefits:', selectedBenefits, 'applicationMethod:', applicationMethod, 'pathogenScope:', pathogenScope, 'pathogenTypes:', pathogenTypes, 'insectTypes:', insectTypes);

  // Step 1: Select benefits
  const handleBenefitChange = (benefit) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefit)
        ? prev.filter((b) => b !== benefit)
        : [...prev, benefit]
    );
    if (benefit === 'Pathogen suppression') {
      setShowPathogen(!selectedBenefits.includes('Pathogen suppression'));
    }
    if (benefit === 'Insect pest biocontrol') {
      setShowInsect(!selectedBenefits.includes('Insect pest biocontrol'));
    }
    console.log('Selected benefits:', selectedBenefits, 'showPathogen:', showPathogen, 'showInsect:', showInsect);
  };

  // Step 2: Application method
  const handleAppMethodChange = (e) => setApplicationMethod(e.target.value);

  // Step 3: Pathogen questions
  const handlePathogenScopeChange = (e) => setPathogenScope(e.target.value);
  const handlePathogenTypeChange = (type) => {
    setPathogenTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Step 4: Insect pest questions
  const handleInsectTypeChange = (type) => {
    setInsectTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Recommendation logic
  const getRecommendations = () => {
    // Map UI application method to product application values
    const appMethodMap = {
      'Soil application': 'Soil',
      'Foliar spray': 'Foliar',
      'Seed treatment': ['Seed treatment', 'Seed'],
      'Compost inoculant': 'Compost',
      'Hydroponic system': 'Hydroponic',
    };
    const mappedAppMethod = appMethodMap[applicationMethod];

    // Pathogen filtering
    if (selectedBenefits.includes('Pathogen suppression') && showPathogen && pathogenTypes.length > 0) {
      return products.filter((product) => {
        const matchesApp = mappedAppMethod
          ? (Array.isArray(mappedAppMethod)
              ? mappedAppMethod.some((m) => product.application.includes(m))
              : product.application.includes(mappedAppMethod))
          : true;
        return matchesApp && product.microbes.some((microbe) => {
          const microbeObj = microbes.find(m => m.name === microbe.name);
          return microbeObj && microbeObj.suppresses && microbeObj.suppresses.some(type => pathogenTypes.includes(type));
        });
      });
    }
    // Insect pest filtering
    if (selectedBenefits.includes('Insect pest biocontrol') && showInsect && insectTypes.length > 0) {
      return products.filter((product) => {
        const matchesApp = mappedAppMethod
          ? (Array.isArray(mappedAppMethod)
              ? mappedAppMethod.some((m) => product.application.includes(m))
              : product.application.includes(mappedAppMethod))
          : true;
        return matchesApp && product.microbes.some((microbe) => {
          const microbeObj = microbes.find(m => m.name === microbe.name);
          return microbeObj && microbeObj.suppresses && microbeObj.suppresses.includes('insects');
        });
      });
    }
    // Otherwise, filter by selected benefits and application method
    return products.filter((product) => {
      const matchesBenefit = product.benefits.some((b) => selectedBenefits.includes(b));
      const matchesApp = mappedAppMethod
        ? (Array.isArray(mappedAppMethod)
            ? mappedAppMethod.some((m) => product.application.includes(m))
            : product.application.includes(mappedAppMethod))
        : true;
      return matchesBenefit && matchesApp;
    });
  };

  // Step navigation handlers
  const handleStart = () => setStep(2);
  const handleNextFromStep2 = () => setStep(3);
  const handleNextFromStep3 = () => {
    if (showPathogen) {
      setStep(4);
    } else if (showInsect) {
      setStep(5);
    } else {
      setStep(6);
    }
  };
  const handleNextFromStep4 = () => {
    if (showInsect) {
      setStep(5);
    } else {
      setStep(6);
    }
  };
  const handleNextFromStep5 = () => setStep(6);
  const prevStep = () => setStep((s) => s - 1);

  // Validation
  const canContinueStep2 = selectedBenefits.length > 0;
  const canContinueStep3 = applicationMethod !== '';
  const canContinueStep4 = !showPathogen || (pathogenTypes.length > 0);
  const canContinueStep5 = !showInsect || (insectTypes.length > 0);

  // UI
  return (
    <div>
      <div className="card">
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <h1 style={{ color: MAIN_GREEN, fontSize: '2.2rem', marginBottom: 16 }}>Welcome to the Microbe Recommendation Tool</h1>
            <p style={{ fontSize: '1.15rem', color: '#444', maxWidth: 520, margin: '0 auto 1.5rem auto' }}>
              This tool helps you find the best Nutri-Tech Solutions microbial products for your crop or soil needs. Answer a few quick questions and get tailored recommendations with science-backed explanations.
            </p>
            <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0 auto 2rem auto', color: '#666', fontSize: '1.05rem', lineHeight: 1.7 }}>
              <li>Step 1: Select the function or problem you want to address</li>
              <li>Step 2: Choose your application method</li>
              <li>Step 3: (If relevant) Specify pathogen or pest details</li>
              <li>Step 4: Get your recommendations!</li>
            </ul>
            <button className="btn-main" style={{ fontSize: '1.15rem', padding: '0.7em 2.2em' }} onClick={handleStart}>Start</button>
          </div>
        )}
        {step === 2 && (
          <>
            <div className="step-title">1. What problem or function do you want to target?</div>
            <div className="step-desc">Select one or more functions you want to address.</div>
            <div>
              {benefits.map((b) => (
                <label key={b.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{b.name}</span>
                    <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 6 }}>{b.description}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(b.name)}
                    onChange={() => handleBenefitChange(b.name)}
                    style={{ marginLeft: 12, width: 18, height: 18 }}
                  />
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button
                className="btn-main"
                onClick={handleNextFromStep2}
                disabled={!canContinueStep2}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="step-title">2. How do you plan to apply the product?</div>
            <div className="step-desc">Choose the main method you will use to apply the product.</div>
            <select value={applicationMethod} onChange={handleAppMethodChange}>
              <option value="">Select method...</option>
              <option value="Soil application">Soil application</option>
              <option value="Foliar spray">Foliar spray</option>
              <option value="Seed treatment">Seed treatment</option>
              <option value="Compost inoculant">Compost inoculant</option>
              <option value="Hydroponic system">Hydroponic system</option>
            </select>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-main" style={{ background: '#eee', color: '#333' }} onClick={prevStep}>
                Back
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep3}
                disabled={!canContinueStep3}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 4 && showPathogen && (
          <>
            <div className="step-title">3. What kind of pathogen is it?</div>
            <div className="step-desc">Select the type(s) of pathogen you want to target.</div>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Fungi</span>
              <input type="checkbox" checked={pathogenTypes.includes('fungi')} onChange={() => handlePathogenTypeChange('fungi')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Bacteria</span>
              <input type="checkbox" checked={pathogenTypes.includes('bacteria')} onChange={() => handlePathogenTypeChange('bacteria')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Virus</span>
              <input type="checkbox" checked={pathogenTypes.includes('virus')} onChange={() => handlePathogenTypeChange('virus')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Nematode</span>
              <input type="checkbox" checked={pathogenTypes.includes('nematodes')} onChange={() => handlePathogenTypeChange('nematodes')} style={{ width: 18, height: 18 }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-main" style={{ background: '#eee', color: '#333' }} onClick={prevStep}>
                Back
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep4}
                disabled={!canContinueStep4}
              >
                Next
              </button>
            </div>
          </>
        )}
        {step === 5 && showInsect && (
          <>
            <div className="step-title">4. What kind of pest is it?</div>
            <div className="step-desc">Select the type(s) of pest you want to target.</div>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Aphid</span>
              <input type="checkbox" checked={insectTypes.includes('aphid')} onChange={() => handleInsectTypeChange('aphid')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Thrip</span>
              <input type="checkbox" checked={insectTypes.includes('thrip')} onChange={() => handleInsectTypeChange('thrip')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Whitefly</span>
              <input type="checkbox" checked={insectTypes.includes('whitefly')} onChange={() => handleInsectTypeChange('whitefly')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Beetle</span>
              <input type="checkbox" checked={insectTypes.includes('beetle')} onChange={() => handleInsectTypeChange('beetle')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Caterpillar</span>
              <input type="checkbox" checked={insectTypes.includes('caterpillar')} onChange={() => handleInsectTypeChange('caterpillar')} style={{ width: 18, height: 18 }} />
            </label>
            <label style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, gap: 12 }}>
              <span>Mite</span>
              <input type="checkbox" checked={insectTypes.includes('mite')} onChange={() => handleInsectTypeChange('mite')} style={{ width: 18, height: 18 }} />
            </label>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-main" style={{ background: '#eee', color: '#333' }} onClick={prevStep}>
                Back
              </button>
              <button
                className="btn-main"
                onClick={handleNextFromStep5}
                disabled={!canContinueStep5}
              >
                Show Recommendations
              </button>
            </div>
          </>
        )}
        {((step === 6) || (step === 4 && !showPathogen && !showInsect) || (step === 5 && !showInsect && !showPathogen)) && (
          <Recommendations
            selectedBenefits={selectedBenefits}
            applicationMethod={applicationMethod}
            products={getRecommendations()}
            allMicrobes={microbes}
            allBenefits={benefits}
            onBack={() => setStep(showInsect ? 5 : showPathogen ? 4 : 3)}
            pathogenTypes={pathogenTypes}
            insectTypes={insectTypes}
          />
        )}
      </div>
    </div>
  );
}

function Recommendations({ selectedBenefits, applicationMethod, products, allMicrobes, allBenefits, onBack, pathogenTypes = [], insectTypes = [] }) {
  // Helper to explain which microbes in a product target the selected pathogen types
  const getPathogenExplanation = (product, pathogenTypes) => {
    const matches = product.microbes
      .map(microbe => {
        const microbeObj = allMicrobes.find(x => x.name === microbe.name);
        if (!microbeObj || !microbeObj.suppresses) return null;
        const matchedTypes = microbeObj.suppresses.filter(type => pathogenTypes.includes(type));
        if (matchedTypes.length > 0) {
          return `${microbe.name} (${matchedTypes.join(', ')})`;
        }
        return null;
      })
      .filter(Boolean);
    if (matches.length > 0) {
      return `Key microbes in this product target: ${matches.join(', ')}.`;
    }
    return '';
  };

  return (
    <div>
      <div className="step-title">Recommended Products</div>
      <div className="step-desc">
        Based on your selections: <strong>{selectedBenefits.join(', ')}</strong>
        {applicationMethod && <> and application method: <strong>{applicationMethod}</strong></>}
        {(pathogenTypes && pathogenTypes.length > 0) && (
          <>
            {' '}<span>with pathogen type: <strong>{pathogenTypes.join(', ')}</strong></span>
          </>
        )}
        {(insectTypes && insectTypes.length > 0) && (
          <>
            {' '}<span>with pest type: <strong>{insectTypes.join(', ')}</strong></span>
          </>
        )}
      </div>
      {products.length === 0 && <div style={{ color: 'crimson', margin: '1.5rem 0' }}>No products found for your selection.</div>}
      {products.map((product) => (
        <div key={product.product_name} style={{ border: '1px solid #e0e0e0', borderRadius: 8, margin: '1.2rem 0', padding: '1rem', background: '#fafcf7' }}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: MAIN_GREEN }}>{product.product_name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '0.5rem 0' }}>
            <img src={product.image} alt={product.product_name} style={{ maxWidth: 120, maxHeight: 120, margin: '0.5rem 0', borderRadius: 6, background: '#fff', objectFit: 'contain' }} />
            <div>
              <a href={product.link} target="_blank" rel="noopener noreferrer" style={{ color: MAIN_GREEN, fontWeight: 600, textDecoration: 'underline', marginRight: 12 }}>Product Page</a>
            </div>
          </div>
          <div style={{ margin: '0.5rem 0' }}>
            <strong>Microbes:</strong> {product.microbes.join(', ')}
          </div>
          <div style={{ margin: '0.5rem 0' }}>
            <strong>Some Benefits:</strong>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {product.benefits.map(b => {
                const benefitObj = allBenefits.find(x => x.name === b);
                return (
                  <li key={b} style={{ color: selectedBenefits.includes(b) ? MAIN_GREEN : '#333', fontWeight: selectedBenefits.includes(b) ? 600 : 400 }}>
                    {b}
                    {benefitObj && (
                      <span style={{ color: '#888', fontSize: '0.95em', marginLeft: 6 }}>({benefitObj.description})</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div style={{ margin: '0.5rem 0', color: '#555', fontSize: '0.97em' }}>
            <strong>Why recommended?</strong> This product matches your needs for: {product.benefits.filter(b => selectedBenefits.includes(b)).join(', ')}.
            {/* If pathogen types were selected, show which microbes target them */}
            {selectedBenefits.includes('Pathogen or pest control') && pathogenTypes && pathogenTypes.length > 0 && (
              <div style={{ marginTop: 4 }}>{getPathogenExplanation(product, pathogenTypes)}</div>
            )}
          </div>
        </div>
      ))}
      <button className="btn-main" style={{ background: '#eee', color: '#333' }} onClick={onBack}>
        Back
      </button>
    </div>
  );
}

export default App;