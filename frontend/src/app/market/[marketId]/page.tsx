'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiService } from '@/service/api/api';
import { toast } from 'react-toastify';

export default function MarketPage() {
  const { marketId } = useParams();
  const [market, setMarket] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = apiService.getCurrentUser();
    if (user?.id) {
      setUserId(user.id);
    }
  }, []);

  const fetchMarketData = async () => {
    try {
      const marketRes = await apiService.get(`/markets/${marketId}`);
      const reviews = await apiService.get(`/review-market/market/${marketId}`);
      marketRes.reviews = reviews;
      setMarket(marketRes);
    } catch (err) {
      console.error(err);
      toast.error('Erro ao carregar dados do mercado.');
    }
  };

  useEffect(() => {
    if (marketId) {
      fetchMarketData();
    }
  }, [marketId]);

  const handleReviewSubmit = async () => {
    if (!rating || !comment) {
      toast.warn('Preencha a nota e o comentário.');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.post('/review-market', { marketId, rating, comment });

      toast.success('Avaliação enviada com sucesso!');
      setRating(0);
      setComment('');
      await fetchMarketData();
    } catch (err) {
      toast.error('Erro ao enviar avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (score: number) => {
    return [...Array(5)].map((_, i) => (i < score ? '★' : '☆')).join(' ');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {market ? (
        <>
          <h1 className="text-3xl font-bold mb-2">{market.name}</h1>
          <p className="text-gray-500 mb-6">
            Localização: {market.latitude}, {market.longitude}
          </p>

          {/* Produtos */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Produtos disponíveis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {market.products.filter((mp: any) => mp.isValid).map((mp: any) => (
                <div key={mp.id} className="p-4 border rounded-lg shadow-sm bg-white">
                  <h3 className="font-semibold">{mp.product.name}</h3>
                  <p className="text-gray-600">R$ {mp.price.toFixed(2)}</p>
                </div>
              ))}
              {market.products.filter((mp: any) => mp.isValid).length === 0 && (
                <p className="text-gray-500 col-span-2">
                  Nenhum produto disponível neste mercado.
                </p>
              )}
            </div>
          </section>

          {/* Avaliações */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>
            {market.reviews.length === 0 ? (
              <p className="text-gray-500">Nenhuma avaliação ainda.</p>
            ) : (
              <div className="space-y-4">
                {market.reviews.map((r: any) => (
                  <div key={r.id} className="border-b pb-4">
                    <p className="text-yellow-500 text-lg font-medium">
                      {renderStars(r.rating)} ({r.rating}/5)
                    </p>
                    <p className="text-gray-800 mt-1">{r.comment}</p>
                    <p className="text-sm text-gray-400">
                      por {r.user.name} em{' '}
                      {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Formulário de avaliação */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Escreva uma avaliação</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Nota:</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRating(val)}
                    className={`text-2xl ${
                      rating >= val ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <label className="block text-sm font-medium">Comentário:</label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Escreva aqui sua experiência..."
              />

              <button
                disabled={submitting}
                onClick={handleReviewSubmit}
                className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                Enviar Avaliação
              </button>
            </div>
          </section>
        </>
      ) : (
        <p className="text-gray-600">Carregando mercado...</p>
      )}
    </div>
  );
}
