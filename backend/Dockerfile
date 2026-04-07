# syntax=docker/dockerfile:1

FROM python:3.12-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.12-slim AS runner
WORKDIR /app
RUN useradd -m pythonuser
USER pythonuser
COPY --from=builder /root/.local /home/pythonuser/.local
ENV PATH=/home/pythonuser/.local/bin:$PATH
COPY ./app ./app
# Set environment variables for FastAPI
ENV PYTHONPATH=/app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
