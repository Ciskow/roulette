import { useState } from 'react';
import confetti from 'canvas-confetti';
import { useRoulette } from './hooks/useRoulette';
import { Breadcrumbs } from './components/Breadcrumbs';
import { RouletteWheel } from './components/RouletteWheel';
import { OptionInput } from './components/OptionInput';
import { TitleEditor } from './components/TitleEditor';
import './App.css';

function App() {
  const {
    currentNode,
    childrenOptions,
    path,
    addOption,
    removeOption,
    updateOption,
    navigateTo
  } = useRoulette();

  const [winner, setWinner] = useState<string | null>(null);

  if (!currentNode) return <div className="loading">Loading...</div>;

  const handleSpinEnd = (selectedId: string) => {
    // Fire confetti!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#98D8C8']
    });

    const option = childrenOptions.find(o => o.id === selectedId);
    if (option) {
      setWinner(option.label);
    }

    // Auto-navigate after delay without popup
    setTimeout(() => {
      if (option) {
        setWinner(null);
        navigateTo(selectedId);
      }
    }, 2000); // 2s delay to celebrate and see winner
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Infinite Roulette</h1>
        <TitleEditor
          initialTitle={currentNode.label}
          onSave={(newTitle) => updateOption(currentNode.id, newTitle)}
        />
      </header>

      <main>
        <div className="breadcrumbs-wrapper">
          <Breadcrumbs path={path} onNavigate={navigateTo} />
        </div>

        <div className="content-side-by-side">
          <div className="game-area">
            <RouletteWheel
              options={childrenOptions}
              onSpinEnd={handleSpinEnd}
            />
          </div>

          <div className="controls-area">
            <h2>Options for "{currentNode.label}"</h2>
            <OptionInput
              options={childrenOptions}
              onAdd={addOption}
              onRemove={removeOption}
              onNavigate={navigateTo}
            />
            <p className="hint-text">Tip: Click an option label to edit it directly</p>
          </div>
        </div>
      </main>

      {winner && (
        <div className="winner-overlay">
          <div className="winner-content">
            <h2>WINNER!</h2>
            <div className="winner-name">{winner}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
