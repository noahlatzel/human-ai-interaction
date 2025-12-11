import type { LearningTip } from '../../../types/learningTip';
import TipCard from './TipCard';

interface TipsListProps {
    tips: LearningTip[];
    loading?: boolean;
    error?: string | null;
    onTipClick: (tip: LearningTip) => void;
    emptyMessage?: string;
}

export default function TipsList({ tips, loading, error, onTipClick, emptyMessage = 'Keine Tipps vorhanden' }: TipsListProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg font-medium">{error}</div>
            </div>
        );
    }

    if (tips.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-slate-400 text-lg">{emptyMessage}</div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((tip) => (
                <TipCard key={tip.id} tip={tip} onClick={() => onTipClick(tip)} />
            ))}
        </div>
    );
}
