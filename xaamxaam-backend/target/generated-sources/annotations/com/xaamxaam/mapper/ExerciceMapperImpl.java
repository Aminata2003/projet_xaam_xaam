package com.xaamxaam.mapper;

import com.xaamxaam.domain.exercice.Exercice;
import com.xaamxaam.domain.exercice.Indice;
import com.xaamxaam.domain.exercice.Reformulation;
import com.xaamxaam.dto.response.ExerciceResponse;
import com.xaamxaam.dto.response.IndiceResponse;
import com.xaamxaam.dto.response.ReformulationResponse;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-09-02T22:15:07+0000",
    comments = "version: 1.6.3, compiler: javac, environment: Java 17.0.20 (Eclipse Adoptium)"
)
@Component
public class ExerciceMapperImpl implements ExerciceMapper {

    @Override
    public ExerciceResponse toResponse(Exercice exercice) {
        if ( exercice == null ) {
            return null;
        }

        UUID id = null;
        String enonce = null;
        String matiere = null;
        String niveau = null;
        Exercice.StatutExercice statut = null;
        LocalDateTime dateCreation = null;

        id = exercice.getId();
        enonce = exercice.getEnonce();
        matiere = exercice.getMatiere();
        niveau = exercice.getNiveau();
        statut = exercice.getStatut();
        dateCreation = exercice.getDateCreation();

        ExerciceResponse exerciceResponse = new ExerciceResponse( id, enonce, matiere, niveau, statut, dateCreation );

        return exerciceResponse;
    }

    @Override
    public IndiceResponse toResponse(Indice indice) {
        if ( indice == null ) {
            return null;
        }

        UUID id = null;
        int niveau = 0;
        String contenu = null;

        id = indice.getId();
        niveau = indice.getNiveau();
        contenu = indice.getContenu();

        IndiceResponse indiceResponse = new IndiceResponse( id, niveau, contenu );

        return indiceResponse;
    }

    @Override
    public ReformulationResponse toResponse(Reformulation reformulation) {
        if ( reformulation == null ) {
            return null;
        }

        UUID id = null;
        String texte = null;
        int score = 0;
        String feedbackIa = null;

        id = reformulation.getId();
        texte = reformulation.getTexte();
        score = reformulation.getScore();
        feedbackIa = reformulation.getFeedbackIa();

        ReformulationResponse reformulationResponse = new ReformulationResponse( id, texte, score, feedbackIa );

        return reformulationResponse;
    }
}
