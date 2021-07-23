FROM harbor.eds.aphp.fr/cohort360/node:14.6.0
WORKDIR /root
COPY ./ ./
ENV REACT_APP_FHIR_API_URL=/api/fhir
ENV REACT_APP_BACK_API_URL=/api/back
ENV REACT_APP_REQUEST_API_URL=/api/fhir
ENV REACT_APP_PORTAIL_API_URL: /api/portail
ENV REACT_APP_CONTEXT=aphp
RUN mkdir -p static
CMD ["bash", "entry-point.sh"]