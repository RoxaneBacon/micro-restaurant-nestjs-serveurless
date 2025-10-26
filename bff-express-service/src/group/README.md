# Group Service
## Évolution de l'état d'un groupe
```mermaid
flowchart TB
%% Nodes
R("READY")
I("IN_PROGRESS")
C("CLOSED")

R-->|"Un permier commande est passé dans ce goupe"|I
I-->|"La commande de groupe est payée par le responsable"|C
```

## Calcul du prix total à payer par le groupe
Le prix total à payer par le groupe est calculé en fonction du nombre de clients attendus et du nombre de clients réels. Si le nombre de clients réels est proche du nombre de clients attendus (écart de 2 clients ou moins), le prix total est calculé sur la base du nombre de clients attendus. Sinon, le prix total est calculé sur la base du nombre de clients réels.
```mermaid
flowchart TB
%% Nodes
A["actualCustomers = expectedCustomers +/- 2 ?"] -->|Oui| B["totalPrice = **expectedCustomers** * menuUnitPrice"]
A -->|Non| C["totalPrice = **actualCustomers** * menuUnitPrice"]
```