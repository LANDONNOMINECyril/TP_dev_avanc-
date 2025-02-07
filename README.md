# TP_dev_avancé

Tout fonctionne excepté :

- les EventEmitter : ils sont codés, implémentés, ne génèrent pas d'erreur, ni dans le terminal, ni dans le navigateur, ni sur le serveur, ni sur le client, mais ne fonctionne pas tout de même.

- les Tests : les tests sont implémentées et fonctionnels, mais il semble manquer un fichier de base pour effectuer les tests, ils marchaient dernièrement mais dans le courant du code ils ont arretés de fonctionner pour une raison que je n'ai pas trouvé :
> realtime-elo-ranker-server@0.0.1 test /home/iut45/Etudiants/o22202952/WinHome/développement avancé/tp1/realtime-elo-ranker/apps/realtime-elo-ranker-server
> jest

● Validation Error:

  Module ts-jest in the transform option was not found.
         <rootDir> is: /home/iut45/Etudiants/o22202952/WinHome/développement avancé/tp1/realtime-elo-ranker/apps/realtime-elo-ranker-server/src

  Configuration Documentation:
  https://jestjs.io/docs/configuration

 ELIFECYCLE  Test failed. See above for more details. 


A remarquer :

Les tests sur les eventEmitter ne passaient pas, tout les autres si, cela veux donc bien dire qu'il y a un problème sur eventEmitter, malgré le fait qu'ils sont correctement implémentés
