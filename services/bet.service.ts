import type { AxiosResponse } from "axios";
import { getIdForRequest } from "~/helpers";
import { request } from "~/helpers/request_axios";
import type { BetModel } from "~/types/api-bet.type";
import type { ServiceProps } from "~/types/common.type";

export default function useBetService(): ServiceProps {
  /**
   * Créer un Pari
   */
  const create = async (bet: BetModel): Promise<AxiosResponse> => {
    return await request(`/admin/bets`, {
      method: "post",
      data: bet,
    });
  };
  /**
   * Mettre à jour un Pari
   */
  const update = async (bet: BetModel): Promise<AxiosResponse> => {
    const productId = getIdForRequest(bet);
    return await request(`/admin/bets/${productId}`, {
      method: "patch",
      data: bet,
    });
  };

  /**
   * Récupérer un Pari spécifique
   */
  const find = async (
    bet: string | BetModel,
    query?: Record<string, any>
  ): Promise<AxiosResponse> => {
    const productId = getIdForRequest(bet);

    return await request(`/admin/bets/${productId}`, {
      method: "get",
      params: query,
    });
  };

  /**
   * Récupérer tous les paris
   */
  const fetch = async (query?: Record<string, any>): Promise<AxiosResponse> => {
    return await request(`/admin/bets`, {
      method: "get",
      params: query,
    });
  };

  /* Récupérer un produit spécifique
   */
  const remove = async (bet: string): Promise<AxiosResponse> => {

    return await request(`/admin/bets/${bet}`, {
      method: "delete",
    });
  };

  /**
   * Récupérer toutes les competitions
   */
  const getCompetitions = async (
    query?: Record<string, any>
  ): Promise<AxiosResponse> => {
    return await request(`/admin/bets/competitions`, {
      method: "get",
      params: query,
    });
  };

  /**
   * Récupérer tous les matchs d'une competition
   */
  const getMatchsCompetition = async (
    id: string,
    query?: Record<string, any>
  ): Promise<AxiosResponse> => {
    return await request(`/admin/bets/competitions/${id}/matches`, {
      method: "get",
      params: query,
    });
  };

  /**
   * Récupérer toutes les equipes d'une competition
   */
  const getTeamsCompetition = async (
    id: string,
    query?: Record<string, any>
  ): Promise<AxiosResponse> => {
    return await request(`/admin/bets/competitions/${id}/teams`, {
      method: "get",
      params: query,
    });
  };

  /**
   * Récupérer tous les details d'un match
   */
  const getMatch = async (
    id: string,
    query?: Record<string, any>
  ): Promise<AxiosResponse> => {
    return await request(`/admin/bets/matches/${id}`, {
      method: "get",
      params: query,
    });
  };
  return {
    fetch,
    create,
    update,
    find,
    remove,
    getCompetitions,
    getMatchsCompetition,
    getTeamsCompetition,
    getMatch,
  };
}
