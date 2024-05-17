import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
    render(<App
        prism={[[1 * scaleFactor, 0 * scaleFactor],
        [-1 / 2 * scaleFactor, 3 ** 0.5 / 2 * scaleFactor],
        [-1 / 2 * scaleFactor, -(3 ** 0.5) / 2 * scaleFactor]]}
        lightStrength={0.05}
        refStrength={0.15}
        IOR={1.5}
        IORChange={0.1}
        spectrumRange={[-1.7, 1.7]}
        spectrumDivide={120}
        RGBInSpectrum={[[-1, 2], [0], [1]]}
        RGBInSpectrumStrength={[[1, 1], [1.1], [1.4]]}
        spectrumToRGBRadius={0.7}
        lightRange={0.08}
        lightBeamNumber={20} />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
