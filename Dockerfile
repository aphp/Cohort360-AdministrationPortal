FROM harbor.eds.aphp.fr/cohort360/node-front:$CI_COMMIT_BRANCH
WORKDIR /root
COPY ./ ./
ENV REACT_APP_PORTAIL_API_URL=/api/portail
ENV REACT_APP_CONTEXT=aphp
RUN mkdir -p static
CMD ["sleep", "infinity"]